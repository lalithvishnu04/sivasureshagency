import json, urllib.request, urllib.error

KEY = 'AIzaSyD3H7U7WwkRWx6hvsQxTGkmGO2Uq9xd4n4'

# Sign in as admin
signin_url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + KEY
body = json.dumps({'email':'admin@sivasureshagency.com','password':'Admin@SSA2024!','returnSecureToken':True}).encode()
req = urllib.request.Request(signin_url, data=body, headers={'Content-Type':'application/json'})
try:
    r = urllib.request.urlopen(req, timeout=15)
    auth = json.loads(r.read())
    id_token = auth['idToken']
    print('Auth OK - user:', auth['email'])
except urllib.error.HTTPError as e:
    print('Auth FAIL:', json.loads(e.read()))
    raise SystemExit(1)

# Test Firestore reads with the user ID token
BASE = 'https://firestore.googleapis.com/v1/projects/siva-suresh-agency/databases/sivasureshagency/documents'
for coll in ['orders', 'products', 'customers', 'inventory']:
    url = BASE + '/' + coll + '?pageSize=2&key=' + KEY
    req2 = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + id_token})
    try:
        r2 = urllib.request.urlopen(req2, timeout=10)
        d = json.loads(r2.read())
        docs = d.get('documents', [])
        print('  ' + coll + ': OK - ' + str(len(docs)) + ' docs returned')
    except urllib.error.HTTPError as e:
        err = json.loads(e.read())
        print('  ' + coll + ': FAIL ' + str(e.code) + ' - ' + err.get('error', {}).get('message', '?'))
