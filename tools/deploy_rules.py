"""
Deploy Firestore security rules to the named database 'sivasureshagency'
using the Firebase Admin SDK service account.

Usage:
    python tools/deploy_rules.py

Requirements:
    pip install google-auth
"""

import json
import os
import sys
import urllib.request
import urllib.error

# ─── Config ────────────────────────────────────────────────────────────────────
PROJECT_ID      = "siva-suresh-agency"
DATABASE_ID     = "sivasureshagency"
SA_KEY_FILE     = "siva-suresh-agency-firebase-adminsdk-fbsvc-3c20702963.json"
RULES_FILE      = "firestore.rules"

# ─── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR    = os.path.dirname(SCRIPT_DIR)
SA_PATH     = os.path.join(ROOT_DIR, SA_KEY_FILE)
RULES_PATH  = os.path.join(ROOT_DIR, RULES_FILE)

# ─── Load service account ──────────────────────────────────────────────────────
print(f"[1/5] Loading service account key: {SA_PATH}")
if not os.path.exists(SA_PATH):
    sys.exit(f"ERROR: Service account file not found: {SA_PATH}")

with open(SA_PATH) as f:
    sa = json.load(f)

# ─── Get OAuth2 access token ───────────────────────────────────────────────────
print("[2/5] Getting OAuth2 access token from service account...")
try:
    import google.oauth2.service_account
    import google.auth.transport.requests

    SCOPES = [
        "https://www.googleapis.com/auth/firebase",
        "https://www.googleapis.com/auth/cloud-platform",
    ]
    credentials = google.oauth2.service_account.Credentials.from_service_account_file(
        SA_PATH, scopes=SCOPES
    )
    req = google.auth.transport.requests.Request()
    credentials.refresh(req)
    token = credentials.token
    print(f"   Token acquired (ends with ...{token[-6:]})")
except Exception as e:
    sys.exit(f"ERROR getting token: {e}")

# ─── Read rules file ────────────────────────────────────────────────────────────
print(f"[3/5] Reading rules: {RULES_PATH}")
if not os.path.exists(RULES_PATH):
    sys.exit(f"ERROR: Rules file not found: {RULES_PATH}")

with open(RULES_PATH) as f:
    rules_content = f.read()

print(f"   Rules loaded ({len(rules_content)} bytes)")

# ─── Helper ─────────────────────────────────────────────────────────────────────
def api(method, path, body=None):
    url = f"https://firebaserules.googleapis.com/v1/{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type":  "application/json",
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        err = json.loads(e.read())
        raise RuntimeError(f"HTTP {e.code}: {json.dumps(err, indent=2)}")

# ─── Create ruleset ─────────────────────────────────────────────────────────────
print("[4/5] Creating new ruleset via Firebase Rules API...")
try:
    ruleset = api(
        "POST",
        f"projects/{PROJECT_ID}/rulesets",
        {
            "source": {
                "files": [
                    {
                        "name":    "firestore.rules",
                        "content": rules_content,
                    }
                ]
            }
        },
    )
    ruleset_name = ruleset["name"]
    print(f"   Ruleset created: {ruleset_name}")
except RuntimeError as e:
    sys.exit(f"ERROR creating ruleset: {e}")

# ─── Update release (named database) ────────────────────────────────────────────
print(f"[5/5] Publishing release for database '{DATABASE_ID}'...")

# Named database release name: cloud.firestore/{databaseId}
release_id   = f"cloud.firestore/{DATABASE_ID}"
release_path = f"projects/{PROJECT_ID}/releases/{release_id}"

# The Firebase Rules PATCH API requires updateMask as a query parameter and
# only the changed field in the body (no wrapping).  The JSON field name is
# rulesetName (camelCase) but the updateMask uses the proto field name
# (ruleset_name, snake_case).

def api_patch_release(release_path, ruleset_name):
    """PATCH a release with proper updateMask query parameter."""
    url = f"https://firebaserules.googleapis.com/v1/{release_path}?updateMask=rulesetName"
    body = json.dumps({"rulesetName": ruleset_name}).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type":  "application/json",
        },
        method="PATCH",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        err_body = e.read()
        raise RuntimeError(f"HTTP {e.code}: {err_body.decode()}")

try:
    release = api_patch_release(release_path, ruleset_name)
    print(f"   Release updated: {release.get('name')}")
except RuntimeError as patch_err:
    print(f"   PATCH failed: {patch_err}")
    print("   Trying POST (create new release)...")
    try:
        release = api(
            "POST",
            f"projects/{PROJECT_ID}/releases",
            {
                "name":        release_path,
                "rulesetName": ruleset_name,
            },
        )
        print(f"   Release created: {release.get('name')}")
    except RuntimeError as post_err:
        sys.exit(f"ERROR publishing release:\n  PATCH: {patch_err}\n  POST: {post_err}")

print()
print("SUCCESS! Security rules deployed to sivasureshagency database.")
print("Refresh the admin panel — all collections should load now.")
