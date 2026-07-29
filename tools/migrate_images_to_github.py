#!/usr/bin/env python3
"""
migrate_images_to_github.py
-----------------------------
One-time migration: move all product images from Supabase Storage
to the GitHub repo (served free via GitHub Pages, no egress charges).

Steps performed:
  1. Read all products from Supabase
  2. Download each unique Supabase Storage image (deduplicated by URL)
  3. Upload to GitHub repo under images/products/
  4. PATCH each Supabase product record with the new GitHub Pages URL
  5. Bulk-delete all migrated files from Supabase Storage

Usage:
    python tools/migrate_images_to_github.py --github-pat <PAT> [--dry-run]

    The script prompts for the Supabase service-role key (input is hidden).
    Get it from: Supabase Dashboard → Project Settings → API → service_role key
"""

import argparse
import base64
import getpass
import hashlib
import json
import re
import sys
import time
from urllib import error, request

# ── Project constants ──────────────────────────────────────────────────────────
SUPABASE_URL    = 'https://kyzlxhncnqahlpfhtoky.supabase.co'
SUPABASE_BUCKET = 'assets'
GITHUB_OWNER    = 'lalithvishnu04'
GITHUB_REPO     = 'sivasureshagency'
GITHUB_BRANCH   = 'main'
GITHUB_IMG_DIR  = 'images/products'
GH_PAGES_BASE   = f'https://{GITHUB_OWNER}.github.io/{GITHUB_REPO}'
SB_STORAGE_HOST = 'kyzlxhncnqahlpfhtoky.supabase.co'


# ── URL helpers ────────────────────────────────────────────────────────────────
def is_supabase_url(url):
    return bool(url and SB_STORAGE_HOST in url and '/storage/v1/object/public/' in url)

def is_github_pages_url(url):
    return bool(url and 'github.io' in url)

def extract_storage_path(url):
    """Return the storage path (after bucket name) from a Supabase Storage URL."""
    m = re.search(r'/storage/v1/object/public/' + re.escape(SUPABASE_BUCKET) + r'/(.+?)(?:\?.*)?$', url)
    return m.group(1) if m else None

def guess_ext(url):
    for e in ('.png', '.jpg', '.jpeg', '.gif', '.webp'):
        if e in url.lower():
            return '.jpg' if e == '.jpeg' else e
    return '.jpg'

def safe_filename(product_name, tag, original_url):
    slug = re.sub(r'[^a-z0-9]+', '-', (product_name + '-' + tag).lower()).strip('-')[:50]
    url_hash = hashlib.md5(original_url.encode()).hexdigest()[:8]
    ext = guess_ext(original_url)
    return f'{slug}-{url_hash}{ext}'


# ── HTTP helpers ───────────────────────────────────────────────────────────────
def _ua():
    return {'User-Agent': 'SSA-ImageMigration/1.0'}

def http_get(url, headers=None):
    req = request.Request(url, headers={**_ua(), **(headers or {})})
    with request.urlopen(req, timeout=30) as r:
        return r.read(), r.headers.get('Content-Type', 'image/jpeg')

def http_patch(url, payload, headers):
    data = json.dumps(payload).encode()
    req = request.Request(url, data=data, method='PATCH',
                          headers={**headers, 'Content-Type': 'application/json', **_ua()})
    with request.urlopen(req, timeout=30) as r:
        return r.status

def http_delete_json(url, payload, headers):
    data = json.dumps(payload).encode()
    req = request.Request(url, data=data, method='DELETE',
                          headers={**headers, 'Content-Type': 'application/json', **_ua()})
    try:
        with request.urlopen(req, timeout=30) as r:
            return r.status
    except error.HTTPError as e:
        return e.code  # storage delete sometimes returns 4xx for already-deleted files


# ── GitHub API ─────────────────────────────────────────────────────────────────
def gh_headers(pat):
    return {
        'Authorization': f'Bearer {pat}',
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    }

def gh_get_sha(path, pat):
    """Return existing file SHA (needed for updates), or None if new file."""
    url = f'https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}'
    try:
        body, _ = http_get(url, gh_headers(pat))
        return json.loads(body).get('sha')
    except error.HTTPError as e:
        if e.code == 404:
            return None
        raise

def gh_upload(path, content_bytes, commit_msg, pat, sha=None):
    url = f'https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}'
    payload = {
        'message': commit_msg,
        'content': base64.b64encode(content_bytes).decode(),
        'branch': GITHUB_BRANCH,
    }
    if sha:
        payload['sha'] = sha
    data = json.dumps(payload).encode()
    req = request.Request(url, data=data, method='PUT',
                          headers={**gh_headers(pat), 'Content-Type': 'application/json', **_ua()})
    with request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


# ── Supabase API ───────────────────────────────────────────────────────────────
def sb_headers(service_key):
    return {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
    }

def sb_get_products(service_key):
    url = (f'{SUPABASE_URL}/rest/v1/products'
           f'?select=id,name,image,mainImage,colorVariants'
           f'&deleted=eq.false&order=name')
    body, _ = http_get(url, sb_headers(service_key))
    return json.loads(body)

def sb_patch_product(product_id, patch, service_key):
    url = f'{SUPABASE_URL}/rest/v1/products?id=eq.{product_id}'
    return http_patch(url, patch, {**sb_headers(service_key), 'Prefer': 'return=minimal'})

def sb_delete_storage(paths, service_key):
    """Bulk-delete a list of storage paths from the assets bucket."""
    url = f'{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}'
    return http_delete_json(url, {'prefixes': paths}, sb_headers(service_key))


# ── Migration core ─────────────────────────────────────────────────────────────
def run(github_pat, service_key, dry_run):
    tag = '[DRY RUN] ' if dry_run else ''
    print(f'\n{tag}Fetching products from Supabase...')

    products = sb_get_products(service_key)
    if isinstance(products, dict) and products.get('code'):
        print(f'ERROR fetching products: {products}')
        sys.exit(1)
    print(f'  {len(products)} products found.\n')

    # url → github_pages_url  (dedup: same Supabase URL in many products = upload once)
    url_cache = {}
    storage_paths = []   # Supabase Storage paths to delete at the end
    errors = []
    uploaded = 0

    def migrate_url(url, prod_name, tag_label):
        nonlocal uploaded
        if not url:
            return url
        if is_github_pages_url(url):
            return url   # already on GitHub Pages
        if not is_supabase_url(url):
            return url   # external URL — leave alone

        if url in url_cache:
            return url_cache[url]  # already processed this session

        filename  = safe_filename(prod_name, tag_label, url)
        gh_path   = f'{GITHUB_IMG_DIR}/{filename}'
        gh_url    = f'{GH_PAGES_BASE}/{gh_path}'

        sp = extract_storage_path(url)

        if dry_run:
            url_cache[url] = gh_url
            if sp:
                storage_paths.append(sp)
            return gh_url

        try:
            img_bytes, _ = http_get(url)
            sha = gh_get_sha(gh_path, github_pat)
            gh_upload(gh_path, img_bytes,
                      f'chore(images): migrate {filename} from Supabase Storage',
                      github_pat, sha)
            url_cache[url] = gh_url
            if sp:
                storage_paths.append(sp)
            uploaded += 1
            time.sleep(0.4)   # stay under GitHub API rate limit (5000 req/hr)
        except Exception as exc:
            errors.append(f'{prod_name}/{tag_label}: {exc}')
            print(f'      ERROR uploading {filename}: {exc}')
            return url  # keep original URL on failure

        return gh_url

    # ── Process each product ───────────────────────────────────────────────────
    for idx, prod in enumerate(products, 1):
        prod_id   = prod['id']
        prod_name = prod.get('name') or str(prod_id)
        patch     = {}

        print(f'  [{idx:>3}/{len(products)}] {prod_name}')

        # image (thumbnail)
        new_img = migrate_url(prod.get('image') or '', prod_name, 'thumb')
        if new_img != (prod.get('image') or ''):
            patch['image'] = new_img

        # mainImage (hero/detail)
        new_main = migrate_url(prod.get('mainImage') or '', prod_name, 'hero')
        if new_main != (prod.get('mainImage') or ''):
            patch['mainImage'] = new_main

        # colorVariants[].images[]
        variants = prod.get('colorVariants') or []
        if isinstance(variants, str):
            try:
                variants = json.loads(variants)
            except Exception:
                variants = []
        new_variants = []
        changed_cv = False
        for vi, variant in enumerate(variants):
            imgs = variant.get('images') or []
            new_imgs = []
            for ii, img_url in enumerate(imgs):
                new_url = migrate_url(img_url, prod_name, f'cv{vi}-i{ii}')
                new_imgs.append(new_url)
            new_v = {**variant, 'images': new_imgs}
            new_variants.append(new_v)
            if new_imgs != imgs:
                changed_cv = True
        if changed_cv:
            patch['colorVariants'] = new_variants

        if not patch:
            print(f'       (no Supabase images — skipped)')
            continue

        if not dry_run:
            try:
                sb_patch_product(prod_id, patch, service_key)
                print(f'       ✓ DB updated ({len(patch)} field(s))')
            except Exception as exc:
                errors.append(f'DB patch {prod_id}: {exc}')
                print(f'       ERROR updating DB: {exc}')
        else:
            fields = ', '.join(patch.keys())
            print(f'       would update: {fields}')

    # ── Delete from Supabase Storage ───────────────────────────────────────────
    unique_paths = list(dict.fromkeys(storage_paths))
    print(f'\n{"─"*60}')
    print(f'Images processed : {len(url_cache)}')
    print(f'Unique GH uploads: {uploaded}')
    print(f'Storage paths    : {len(unique_paths)}')

    if not dry_run and unique_paths:
        print(f'\nDeleting {len(unique_paths)} file(s) from Supabase Storage...')
        BATCH = 100
        for start in range(0, len(unique_paths), BATCH):
            batch = unique_paths[start:start + BATCH]
            status = sb_delete_storage(batch, service_key)
            print(f'  Batch {start // BATCH + 1}: HTTP {status}')

    if errors:
        print(f'\n⚠  {len(errors)} error(s):')
        for e in errors:
            print(f'   • {e}')
        sys.exit(1)
    else:
        if dry_run:
            print('\n✓ Dry run complete — no changes made.')
            print('  Re-run without --dry-run to apply the migration.')
        else:
            print('\n✓ Migration complete! All images are now on GitHub Pages.')
            print('  Commit & push the new images/products/ folder to go live:')
            print('    git add images/products/ && git commit -m "chore: migrated product images" && git push')


# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    ap = argparse.ArgumentParser(description='Migrate product images: Supabase Storage → GitHub Pages')
    ap.add_argument('--github-pat', required=True,
                    help='GitHub Fine-grained PAT (repo Contents: Read & Write)')
    ap.add_argument('--service-key', default=None,
                    help='Supabase service-role key (omit to be prompted securely)')
    ap.add_argument('--dry-run', action='store_true',
                    help='Preview what would change — makes no writes')
    args = ap.parse_args()

    if args.service_key:
        svc_key = args.service_key.strip()
    else:
        print('Enter your Supabase service-role key.')
        print('  Find it at: Supabase Dashboard → Project Settings → API → service_role')
        svc_key = getpass.getpass('  Service-role key: ').strip()
    if not svc_key:
        print('ERROR: service-role key is required.'); sys.exit(1)

    run(github_pat=args.github_pat, service_key=svc_key, dry_run=args.dry_run)
