// ============================================================
//  Siva Suresh Agency — Service Worker
//  Auto cache-busting: bump CACHE_VERSION with each deploy
// ============================================================
const CACHE_VERSION = 'v60';
const CACHE_NAME = `ssa-${CACHE_VERSION}`;

// Install: activate immediately (skip waiting)
self.addEventListener('install', () => self.skipWaiting());

// Activate: delete ALL old ssa-* caches, then claim all tabs
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(k => k.startsWith('ssa-') && k !== CACHE_NAME)
                    .map(k => { console.log('[SW] Purging old cache:', k); return caches.delete(k); })
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch strategy:
//   HTML documents  → Network-first  (always fresh)
//   JS/CSS ?v=xx    → Cache-first    (version string = bust)
//   Images          → Cache-first
//   Everything else → Network passthrough
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    // Only handle same-origin GET requests
    if (req.method !== 'GET' || url.origin !== self.location.origin) return;

    const isDoc   = req.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/sivasureshagency/' || url.pathname === '/sivasureshagency';
    const isAsset = url.search.includes('v=') && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'));
    const isImage = req.destination === 'image';

    if (isDoc) {
        // Network-first: user always gets the latest HTML
        event.respondWith(
            fetch(req)
                .then(res => { _cache(req, res.clone()); return res; })
                .catch(() => caches.match(req))
        );
    } else if (isAsset || isImage) {
        // Cache-first: versioned assets never change
        event.respondWith(
            caches.match(req).then(cached => {
                if (cached) return cached;
                return fetch(req).then(res => { _cache(req, res.clone()); return res; });
            })
        );
    }
    // All other requests (Supabase API, CDN fonts, etc.) pass through untouched
});

function _cache(req, res) {
    if (!res || res.status !== 200 || res.type === 'opaque') return;
    caches.open(CACHE_NAME).then(c => c.put(req, res));
}


