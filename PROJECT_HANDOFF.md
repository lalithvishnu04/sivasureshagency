# Siva Suresh Agency � Project Handoff

## 1. Live URLs

| Page | URL |
|---|---|
| Home | https://lalithvishnu04.github.io/sivasureshagency/ |
| Categories / Shop | https://lalithvishnu04.github.io/sivasureshagency/categories.html |
| About | https://lalithvishnu04.github.io/sivasureshagency/about.html |
| Services | https://lalithvishnu04.github.io/sivasureshagency/services.html |
| Contact | https://lalithvishnu04.github.io/sivasureshagency/contact.html |
| Wishlist | https://lalithvishnu04.github.io/sivasureshagency/wishlist.html |
| **Admin Panel** | https://lalithvishnu04.github.io/sivasureshagency/admin.html |

---

## 2. GitHub Repository

| Field | Value |
|---|---|
| Repo URL | https://github.com/lalithvishnu04/sivasureshagency |
| Owner | lalithvishnu04 |
| Branch | main (auto-deploys via GitHub Pages) |

### Deploy
```bash
git add .
git commit -m "Description"
git push origin main
# GitHub Pages deploys in ~1 minute
```

---

## 3. Supabase (Backend / Database / Auth)

| Field | Value |
|---|---|
| Dashboard | https://supabase.com/dashboard/project/kyzlxhncnqahlpfhtoky |
| Project ID | kyzlxhncnqahlpfhtoky |
| Project URL | https://kyzlxhncnqahlpfhtoky.supabase.co |
| Anon key (public) | sb_publishable_0hcswuIONUUJPdBl7RRIHw_JH7MsGeK |
| Service Role key | SECRET � keep in password manager only, never commit to git |
| Storage bucket | assets |

### Auth Settings
- Site URL: `https://lalithvishnu04.github.io/sivasureshagency/`
- Redirect URLs: same + `/*` wildcard
- Email confirmation: **OFF** (users activate instantly)
- SMTP: Default Supabase (rate-limited 4/hr). Upgrade to custom SMTP for production.

### Admin Account
| | |
|---|---|
| Email | admin@sivasureshagency.com |
| Password | Set by you � use `python tools/setup-admin-user.py` to reset |

To reset admin password:
```bash
python tools/setup-admin-user.py
# Paste service_role key when prompted, set new password
```

---

## 4. Database Tables

| Table | Purpose |
|---|---|
| `products` | Catalogue: name, category, price, sizes, colorVariants (jsonb), badge |
| `inventory` | Stock per size+color: productName, size, color, quantity, status |
| `orders` | Customer orders |
| `customers` | Registered customer accounts |
| `messages` | Contact form submissions |

### Products columns
```
id, name, category, price, oldPrice, gender, sleeve,
sizes(jsonb), description, image, colorVariants(jsonb),
badge, totalStock, createdAt, updatedAt
```

### Inventory status values
`in_stock` | `low_stock` | `out_of_stock`

---

## 5. File Structure

```
/
+-- index.html           Home page
+-- categories.html      Shop / product listing
+-- about.html
+-- services.html
+-- contact.html
+-- wishlist.html
+-- admin.html           Admin dashboard
+-- sw.js                Service Worker � auto cache-busting
�
+-- css/
�   +-- style.css        Frontend styles
�   +-- admin.css        Admin panel styles
�
+-- js/
�   +-- script.js            Frontend (products, cart, auth, modals)
�   +-- admin.js             Admin panel logic
�   +-- firebase-db-init.js  Supabase compat layer (window.auth, window.db)
�   +-- firebase-integration.js  Inventory loader, stock variant maps
�   +-- api.js               Optional REST API client (disabled, SSA_API_BASE='')
�   +-- backend-config.js    Supabase URL + anon key
�
+-- images/Images/       Product and brand images
�
+-- tools/               Local admin scripts
    +-- setup-admin-user.py   Create/reset admin Supabase account
    +-- fix_inventory.py      Fill missing inventory rows
    +-- seed_firestore.py     Seed products to Supabase
    +-- dedup_firestore.py    Remove duplicate inventory rows
    +-- add_test_order.py     Insert test orders
```

---

## 6. Frontend Architecture

**Stack:** Pure HTML/CSS/JS � no framework, no build step.

### Page load sequence
1. Supabase JS SDK (CDN) loads
2. `backend-config.js` sets Supabase URL + key
3. `firebase-db-init.js` initialises `window.auth`, `window.db`, `window.storage`
4. `firebase-integration.js` loads inventory from Supabase, builds stock maps
5. `script.js` renders products, handles cart/auth/checkout

### Cart & Wishlist
Stored in browser `localStorage` � persist across sessions on same browser.

### Asset Versioning (cache busting)
All CSS/JS loaded with `?v=XX`. When changing a file, bump the version in all HTML files:
```powershell
$v_old = '?v=30'; $v_new = '?v=31'
@('index.html','admin.html','about.html','categories.html','contact.html','services.html','wishlist.html') | ForEach-Object {
    (Get-Content $_ -Raw).Replace($v_old, $v_new) | Set-Content $_ -NoNewline
}
# Also update sw.js: change CACHE_VERSION = 'v31'
```

---

## 7. Service Worker � Auto Cache Clearing

`sw.js` is registered on all pages. Behaviour:

| Request type | Strategy |
|---|---|
| HTML pages | **Network-first** � always fresh from server |
| JS/CSS (`?v=xx`) | **Cache-first** � version string handles busting |
| Images | **Cache-first** |
| Supabase API / CDN | Pass-through (not cached) |

On every new deploy, the SW activates, **purges all old `ssa-v*` caches**, and claims all open tabs � users automatically get the new version.

**After each deploy, update `sw.js` line 5:**
```js
const CACHE_VERSION = 'v31'; // match your HTML version number

---

## 8. Pending Action Items (complete before full production launch)

### 🔴 Critical — do when enabling Razorpay Live

| Step | Where | What to do |
|---|---|---|
| 1 | `js/backend-config.js` → `keyId` field | Replace `rzp_test_TI67q5KZaLNQgp` with your live Razorpay key ID (`rzp_live_...`) |
| 2 | Supabase Dashboard → Edge Functions → `ssa` → Secrets | Set `RAZORPAY_KEY_ID` = your live key ID |
| 3 | Same page | Set `RAZORPAY_KEY_SECRET` = your live key secret (never commit to git) |

All 3 must be updated together at the same time.

---

### 🟡 Recommended — future code hardening (needs dev work)

| Item | Description |
|---|---|
| **Server-side amount validation** | Edge Function creates Razorpay order but doesn't cross-check amount vs `orders.total` in DB. A tampered client could pass a lower amount. Fix: fetch `orders` row in Edge Function and compare before creating Razorpay order. |
| **Supabase SMTP upgrade** | Default Supabase email is rate-limited to 4/hr. Set a custom SMTP (e.g. SendGrid, Resend) in Supabase Dashboard → Auth → SMTP for reliable OTP/password-reset emails. |
| **Rate limiting on Edge Function** | Add per-IP or per-email rate limiting on OTP request endpoint to prevent abuse. |
```

---

## 8. Admin Panel Features

| Section | Function |
|---|---|
| Dashboard | Stats, revenue, low-stock alerts, recent messages |
| Orders | View / update status / print invoice / export CSV |
| Products | Add, edit, delete; upload images per color variant |
| Inventory | View/update stock per size+color; sync from products |
| Customers | Registered customer list |
| Messages | Contact form inbox |

### Adding / editing a product
1. Admin ? Products ? **+ Add Product** (or click edit icon)
2. Fill name, category, price, sizes (comma-separated), description
3. **Color Variants**: click **+ Add Color** for each color
   - Click the color swatch ? color picker opens
   - Type the color name
   - Click **Add Image** tiles to upload photos for that color
4. Click **Save Product**

---

## 9. Customer Password Reset

1. Customer clicks "Forgot Password"
2. Supabase sends a reset email (default SMTP, may land in spam)
3. Customer clicks link ? lands back on the site ? sets new password
4. **Note:** Customer must have registered via the site (not pre-migration localStorage account)

---

## 10. Important Notes

- The **anon key** is safe to expose in frontend JS. Never expose the `service_role` key.
- Product images are stored as **base64 data URLs** inside `colorVariants` JSONB in Supabase.
- `productsData` in `script.js` is a local JS array used as initial/fallback data. Supabase is the source of truth for admin edits.
- Inventory is loaded fresh from Supabase `inventory` table on each page load.
- The `firebase.json` and `firestore.rules` files are legacy artifacts from an earlier Firebase version � they are unused.