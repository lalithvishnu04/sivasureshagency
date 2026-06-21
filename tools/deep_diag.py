"""
Deep diagnostic: test all Firebase access patterns to find the root cause of 403 errors.
"""
import json, urllib.request, urllib.error

KEY = 'AIzaSyD3H7U7WwkRWx6hvsQxTGkmGO2Uq9xd4n4'
BASE = 'https://firestore.googleapis.com/v1/projects/siva-suresh-agency/databases/sivasureshagency/documents'

def fs_get(coll, token=None, label=''):
    url = BASE + '/' + coll + '?pageSize=1&key=' + KEY
    headers = {}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    req = urllib.request.Request(url, headers=headers)
    try:
        r = urllib.request.urlopen(req, timeout=10)
        d = json.loads(r.read())
        docs = d.get('documents', [])
        print(f'  [{label}] {coll}: OK - {len(docs)} docs')
        return True
    except urllib.error.HTTPError as e:
        msg = json.loads(e.read()).get('error', {}).get('message', '?')
        print(f'  [{label}] {coll}: FAIL {e.code} - {msg}')
        return False

# Test 1: anonymous sign-in (creates a valid Firebase Auth token with no email)
print('\n=== Test 1: Anonymous Firebase Auth token ===')
anon_url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + KEY
req = urllib.request.Request(anon_url, data=b'{}', headers={'Content-Type': 'application/json'})
try:
    r = urllib.request.urlopen(req, timeout=10)
    anon = json.loads(r.read())
    anon_token = anon['idToken']
    print('  Anon sign-in OK, uid:', anon['localId'])
    for coll in ['products', 'orders']:
        fs_get(coll, anon_token, 'anon')
except Exception as e:
    print('  Anon sign-in FAIL:', e)

# Test 2: no token (pure API key)
print('\n=== Test 2: No auth token (just API key) ===')
for coll in ['products', 'orders']:
    fs_get(coll, None, 'no-auth')

# Test 3: admin user ID token
print('\n=== Test 3: Admin user ID token ===')
signin_url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + KEY
body = json.dumps({'email':'admin@sivasureshagency.com','password':'Admin@SSA2024!','returnSecureToken':True}).encode()
req = urllib.request.Request(signin_url, data=body, headers={'Content-Type':'application/json'})
try:
    r = urllib.request.urlopen(req, timeout=15)
    auth = json.loads(r.read())
    admin_token = auth['idToken']
    print('  Admin sign-in OK, uid:', auth['localId'])
    for coll in ['products', 'orders', 'customers']:
        fs_get(coll, admin_token, 'admin')
except Exception as e:
    print('  Admin sign-in FAIL:', e)

# Test 4: try fetching a SPECIFIC document (GET vs LIST operation)
print('\n=== Test 4: GET specific doc via admin SDK (to get a doc ID) ===')
import google.oauth2.service_account, google.auth.transport.requests
creds = google.oauth2.service_account.Credentials.from_service_account_file(
    'siva-suresh-agency-firebase-adminsdk-fbsvc-3c20702963.json',
    scopes=['https://www.googleapis.com/auth/datastore']
)
creds.refresh(google.auth.transport.requests.Request())
sa_token = creds.token
url = BASE + '/products?pageSize=1'
req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + sa_token})
try:
    r = urllib.request.urlopen(req, timeout=10)
    d = json.loads(r.read())
    docs = d.get('documents', [])
    if docs:
        doc_path = docs[0]['name']  # full resource name
        doc_id = doc_path.split('/')[-1]
        print(f'  Got doc ID: {doc_id}')

        # Now try to GET that specific doc with no auth, anon, and admin tokens
        for label, tok in [('no-auth', None), ('anon', anon_token if 'anon_token' in dir() else None), ('admin', admin_token if 'admin_token' in dir() else None)]:
            if tok is None and label != 'no-auth':
                continue
            url2 = BASE + '/products/' + doc_id + '?key=' + KEY
            headers2 = {}
            if tok:
                headers2['Authorization'] = 'Bearer ' + tok
            req2 = urllib.request.Request(url2, headers=headers2)
            try:
                r2 = urllib.request.urlopen(req2, timeout=10)
                print(f'  [{label}] GET /products/{doc_id}: OK')
            except urllib.error.HTTPError as e2:
                print(f'  [{label}] GET /products/{doc_id}: FAIL {e2.code}')
    else:
        print('  No product docs returned by SA token either!')
except Exception as e:
    print('  SA get products failed:', e)
