"""
Fix Supabase inventory:
1. Remove duplicate rows (keep lowest id per productName+size+color)
2. Insert missing 90x100 size entries for all bedsheet products
3. Fix any remaining status issues
"""
import sys, json, requests

SUPABASE_URL = "https://kyzlxhncnqahlpfhtoky.supabase.co"
ANON_KEY     = "sb_publishable_0hcswuIONUUJPdBl7RRIHw_JH7MsGeK"
EMAIL        = "admin@sivasureshagency.com"
PASSWORD     = "Admin@SSA2024!"

# ── Auth ──────────────────────────────────────────────────────────
def sign_in():
    r = requests.post(f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
                      headers={"apikey": ANON_KEY, "Content-Type": "application/json"},
                      json={"email": EMAIL, "password": PASSWORD})
    r.raise_for_status()
    token = r.json().get("access_token")
    print(f"  Signed in OK (token starts: {token[:20]}...)")
    return token

def headers(token):
    return {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

# ── Fetch all inventory ───────────────────────────────────────────
def fetch_all(token):
    rows = []
    offset = 0
    while True:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/inventory?select=id,productName,size,color,status,quantity&order=id.asc&limit=1000&offset={offset}",
            headers=headers(token)
        )
        r.raise_for_status()
        chunk = r.json()
        if not chunk:
            break
        rows.extend(chunk)
        if len(chunk) < 1000:
            break
        offset += 1000
    print(f"  Fetched {len(rows)} inventory rows")
    return rows

# ── Dedup ─────────────────────────────────────────────────────────
def dedup(rows, token):
    seen = {}
    to_delete = []
    for row in sorted(rows, key=lambda x: x["id"]):
        key = (row["productName"], row["size"], row["color"])
        if key in seen:
            to_delete.append(row["id"])
        else:
            seen[key] = row["id"]

    print(f"  Found {len(to_delete)} duplicate rows to delete")
    deleted = 0
    for rid in to_delete:
        r = requests.delete(
            f"{SUPABASE_URL}/rest/v1/inventory?id=eq.{rid}",
            headers=headers(token)
        )
        if r.status_code in (200, 204):
            deleted += 1
        else:
            print(f"  WARN: delete id={rid} failed {r.status_code}: {r.text[:80]}")
    print(f"  Deleted {deleted} duplicates")
    return seen  # productName+size+color -> id (survivors)

# ── Fill missing inventory entries ────────────────────────────────
BEDSHEET_COLORS = ["White", "Sky Blue", "Forest Green", "Navy Blue", "Maroon"]
HOSPITAL_LINEN_COLORS = ["White", "Teal", "Royal Blue", "Forest Green", "Charcoal"]

# Expected sizes per category
EXPECTED = {
    # Bedsheets
    "Bedsheet - Striped Blue & White":        {"sizes": ["60x90","60x100","90x100"], "colors": BEDSHEET_COLORS},
    "Bedsheet - Checked Blue":                {"sizes": ["60x90","60x100","90x100"], "colors": BEDSHEET_COLORS},
    "Pillow Cover - Light Blue Set":          {"sizes": ["Standard","Large"],        "colors": BEDSHEET_COLORS},
    "Bedspread & Pillow Cover Set - Striped": {"sizes": ["Single","Double","King"],  "colors": BEDSHEET_COLORS},
    # Hospital linen
    "Abdominal Sheet 9x9":                    {"sizes": ["9x9","Standard"],          "colors": HOSPITAL_LINEN_COLORS},
    "Hospital Towel - OT Grade":              {"sizes": ["36x1m","36x1.25m","60x2m"],"colors": HOSPITAL_LINEN_COLORS},
    "Surgical Cap & Mask Set":                {"sizes": ["Standard","Large"],        "colors": HOSPITAL_LINEN_COLORS},
    "Surgeon Apron - Ladies":                 {"sizes": ["S","M","L","XL","XXL","XXXL"],"colors": HOSPITAL_LINEN_COLORS},
    "Patient Gown - Cotton":                  {"sizes": ["S","M","L","XL","XXL","XXXL"],"colors": HOSPITAL_LINEN_COLORS},
    "Surgeon Apron - Gents":                  {"sizes": ["S","M","L","XL","XXL","XXXL"],"colors": HOSPITAL_LINEN_COLORS},
    "Surgical Eye Pad":                       {"sizes": ["Standard"],                 "colors": HOSPITAL_LINEN_COLORS},
    "Female Surgeon Apron - Green":           {"sizes": ["S","M","L","XL","XXL","XXXL"],"colors": HOSPITAL_LINEN_COLORS},
    "OT Nighty - Patient Wear":               {"sizes": ["S","M","L","XL","XXL","XXXL"],"colors": HOSPITAL_LINEN_COLORS},
}

def fill_missing(survivors, token):
    to_insert = []
    for product, conf in EXPECTED.items():
        for size in conf["sizes"]:
            for color in conf["colors"]:
                key = (product, size, color)
                if key not in survivors:
                    to_insert.append({
                        "productName": product,
                        "size": size,
                        "color": color,
                        "status": "in_stock",
                        "quantity": 20,
                        "updatedAt": "2026-01-01T00:00:00Z"
                    })

    print(f"  Inserting {len(to_insert)} missing inventory entries")
    # Batch insert in chunks of 100
    for i in range(0, len(to_insert), 100):
        batch = to_insert[i:i+100]
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/inventory",
            headers={**headers(token), "Prefer": "resolution=ignore-duplicates,return=minimal"},
            json=batch
        )
        if r.status_code not in (200, 201, 204):
            print(f"  WARN: insert batch {i//100+1} failed {r.status_code}: {r.text[:120]}")
        else:
            print(f"  Inserted batch {i//100+1} ({len(batch)} rows) OK")

# ── Verify ────────────────────────────────────────────────────────
def verify(token):
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/inventory?select=productName,size,color,status&productName=eq.Bedsheet - Checked Blue&order=size,color",
        headers=headers(token)
    )
    r.raise_for_status()
    rows = r.json()
    print(f"\n  Bedsheet - Checked Blue inventory ({len(rows)} rows):")
    for row in rows:
        print(f"    {row['size']:10} {row['color']:15} {row['status']}")

    # Total inventory count
    r2 = requests.get(
        f"{SUPABASE_URL}/rest/v1/inventory?select=id",
        headers={**headers(token), "Prefer": "count=exact"},
        params={"limit": "1"}
    )
    count = r2.headers.get("content-range", "?").split("/")[-1]
    print(f"\n  Total inventory rows: {count}")

if __name__ == "__main__":
    print("\nInventory Fix Tool")
    print("==================\n")

    print("[1/4] Signing into Supabase...")
    token = sign_in()

    print("\n[2/4] Fetching all inventory rows...")
    rows = fetch_all(token)

    print("\n[3/4] Removing duplicates...")
    survivors = dedup(rows, token)

    print("\n[4/4] Filling missing inventory entries...")
    fill_missing(survivors, token)

    verify(token)
    print("\nDone.")
