"""
SSA Admin User Setup  ─  setup-admin-user.py
─────────────────────────────────────────────
Creates (or recreates) the admin@sivasureshagency.com account in Supabase
with email_confirm=True so no confirmation email is needed.

How to run:
  python tools/setup-admin-user.py

You will be prompted for:
  1. Your Supabase SERVICE ROLE key  (NOT the anon/publishable key)
     Location: Supabase Dashboard → Settings (gear icon) → API
               → "Project API keys" → "service_role" → Reveal → Copy
  2. The password you want for admin@sivasureshagency.com
"""

import urllib.request
import urllib.error
import json
import getpass
import sys

SUPABASE_URL  = "https://kyzlxhncnqahlpfhtoky.supabase.co"
ADMIN_EMAIL   = "admin@sivasureshagency.com"

print("\n╔══════════════════════════════════════════════════════╗")
print("║       SSA Admin User Setup — Supabase               ║")
print("╚══════════════════════════════════════════════════════╝\n")
print("You need your SERVICE ROLE key (secret key, not the publishable key).")
print("Find it at: Supabase → Settings → API → service_role → Reveal\n")

service_role_key = getpass.getpass("Paste service_role key (input hidden): ").strip()
if not service_role_key:
    print("❌  No key entered. Exiting.")
    sys.exit(1)

print("")
while True:
    password = getpass.getpass("Set admin password (min 8 chars): ").strip()
    if len(password) >= 8:
        break
    print("   Password must be at least 8 characters, try again.")

headers = {
    "apikey":        service_role_key,
    "Authorization": f"Bearer {service_role_key}",
    "Content-Type":  "application/json"
}

def api(method, path, body=None):
    url  = SUPABASE_URL + path
    data = json.dumps(body).encode() if body else None
    req  = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read()), None
    except urllib.error.HTTPError as ex:
        try:
            err = json.loads(ex.read())
        except Exception:
            err = {"message": str(ex)}
        return None, err
    except Exception as ex:
        return None, {"message": str(ex)}

# ── 1. Find and delete any existing user with this email ──────────────────────
print(f"\n→ Checking for existing user [{ADMIN_EMAIL}]…")
data, err = api("GET", f"/auth/v1/admin/users?email={ADMIN_EMAIL}&per_page=10")
if err:
    print(f"  Warning: could not list users — {err.get('message','?')}")
else:
    for u in (data or {}).get("users", []):
        if u.get("email","").lower() == ADMIN_EMAIL.lower():
            uid = u["id"]
            print(f"  Found existing user {uid} — deleting…")
            _, derr = api("DELETE", f"/auth/v1/admin/users/{uid}")
            if derr:
                print(f"  ❌  Delete failed: {derr.get('message','?')}")
                sys.exit(1)
            print("  ✓  Deleted.")

# ── 2. Create confirmed admin user ────────────────────────────────────────────
print(f"\n→ Creating [{ADMIN_EMAIL}] with email pre-confirmed…")
result, err = api("POST", "/auth/v1/admin/users", {
    "email":          ADMIN_EMAIL,
    "password":       password,
    "email_confirm":  True,
    "user_metadata":  {"role": "admin"}
})

if err:
    msg = err.get("message", str(err))
    print(f"\n❌  Failed to create user: {msg}")
    if "service_role" in msg.lower() or "forbidden" in msg.lower() or "unauthorized" in msg.lower():
        print("    → Make sure you used the SERVICE ROLE key, not the publishable/anon key.")
    sys.exit(1)

uid       = result.get("id", "?")
confirmed = result.get("email_confirmed_at", "NOT confirmed")
print(f"\n✅  Admin user created successfully!")
print(f"   ID:              {uid}")
print(f"   Email:           {ADMIN_EMAIL}")
print(f"   Confirmed at:    {confirmed}")
print(f"\n   👉  Go to https://lalithvishnu04.github.io/sivasureshagency/admin.html")
print(f"       Email:    {ADMIN_EMAIL}")
print(f"       Password: (the one you just set)\n")
