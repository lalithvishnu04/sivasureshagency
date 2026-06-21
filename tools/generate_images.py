#!/usr/bin/env python3
from PIL import Image
import os
import sys

ROOT = os.path.join(os.path.dirname(__file__), '..', 'images', 'Images')
OUT_DIR = ROOT
SIZES = [480, 800]
QUALITY = 85

if not os.path.isdir(OUT_DIR):
    print('Images folder not found:', OUT_DIR)
    sys.exit(1)

exts = ('.jpg', '.jpeg', '.png')

for fname in os.listdir(OUT_DIR):
    fpath = os.path.join(OUT_DIR, fname)
    if not os.path.isfile(fpath):
        continue
    if fname.lower().endswith('.webp'):
        continue
    base, ext = os.path.splitext(fname)
    if any(base.endswith(f'-{s}') for s in SIZES):
        # already a sized variant
        continue
    if not fname.lower().endswith(exts):
        print('Skipping non-raster:', fname)
        continue
    try:
        im = Image.open(fpath)
    except Exception as e:
        print('Cannot open', fname, e)
        continue
    for w in SIZES:
        # compute target size keeping aspect ratio
        try:
            ratio = w / float(im.width)
            h = int(round(im.height * ratio))
            resized = im.convert('RGB')
            resized = resized.resize((w, h), Image.LANCZOS)
            out_name = f"{base}-{w}{ext}"
            out_path = os.path.join(OUT_DIR, out_name)
            if out_path.lower().endswith('.png'):
                resized.save(out_path, optimize=True)
            else:
                resized.save(out_path, quality=QUALITY, optimize=True)
            print('Wrote', out_name)
            # write webp
            webp_name = f"{base}-{w}.webp"
            webp_path = os.path.join(OUT_DIR, webp_name)
            resized.save(webp_path, 'WEBP', quality=80, method=6)
            print('Wrote', webp_name)
        except Exception as e:
            print('Failed to write variant for', fname, 'size', w, e)

print('Done')
