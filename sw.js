// ============================================================
//  Siva Suresh Agency -- Service Worker  v114
//  Auto cache-busting: bump CACHE_VERSION with each deploy
// ============================================================
const CACHE_VERSION = 'v129';
const CACHE_NAME    = `ssa-${CACHE_VERSION}`;

// Separate long-lived API cache -- survives SW version bumps so users
// don't lose their cached product data after a code deploy.
const API_CACHE_NAME   = 'ssa-api-v1';
const API_CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours -- matches script.js localStorage TTL

// Only cache GET calls to the products table (safe, public, rarely changes).
// Orders, auth, and settings are intentionally excluded -- they must stay live.
const SUPABASE_HOST      = 'kyzlxhncnqahlpfhtoky.supabase.co';
const CACHEABLE_API_PATH = '/rest/v1/products';

// -- Install: activate immediately -------------------------------------------
self.addEventListener('install', () => self.skipWaiting());

// -- Activate: prune old ssa-v* caches, keep the API cache intact ------------
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(k => k.startsWith('ssa-v') && k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// -- Fetch router ------------------------------------------------------------
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    // 1) Supabase products API -> stale-while-revalidate
    //    Serve cached response INSTANTLY. If stale, refresh in background.
    //    Result: zero added latency for the user, reduced egress for Supabase.
    if (req.method === 'GET' &&
        url.hostname === SUPABASE_HOST &&
        url.pathname.startsWith(CACHEABLE_API_PATH)) {

        event.respondWith(_apiStaleWhileRevalidate(event, req));
        return;
    }

    // Only handle same-origin GET for everything else
    if (req.method !== 'GET' || url.origin !== self.location.origin) return;

    const isDoc   = req.destination === 'document'
                 || url.pathname.endsWith('.html')
                 || url.pathname === '/sivasureshagency/'
                 || url.pathname === '/sivasureshagency';
    const isAsset = url.search.includes('v=')
                 && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'));
    const isImage = req.destination === 'image';

    if (isDoc) {
        // 2) HTML -- network-first so users always see the latest page
        event.respondWith(
            fetch(req)
                .then(res => { _putCache(CACHE_NAME, req, res.clone()); return res; })
                .catch(() => caches.match(req))
        );
    } else if (isAsset || isImage) {
        // 3) Versioned JS/CSS and images -- cache-first (version string acts as bust)
        event.respondWith(
            caches.match(req).then(cached => cached || fetch(req).then(res => {
                _putCache(CACHE_NAME, req, res.clone());
                return res;
            }))
        );
    }
    // 4) Everything else (Supabase auth/orders, fonts) -- network passthrough
});

// -- Stale-while-revalidate for Supabase products API -----------------------
// Strategy:
//   Fresh cache  -> return immediately, NO network call (zero egress)
//   Stale cache  -> return immediately, refresh in background (no UX delay)
//   No cache yet -> fetch network, cache result, return to browser
async function _apiStaleWhileRevalidate(event, req) {
    const cache  = await caches.open(API_CACHE_NAME);
    const cached = await cache.match(req);

    if (cached) {
        const cachedAt = Number(cached.headers.get('x-sw-cached-at') || 0);
        const isFresh  = (Date.now() - cachedAt) < API_CACHE_TTL_MS;

        if (!isFresh) {
            // Stale -- kick off a background refresh without blocking the response.
            // event.waitUntil keeps the SW alive until the fetch completes.
            event.waitUntil(_fetchAndStore(req, cache));
        }
        // Return cached response instantly whether fresh or stale
        return cached;
    }

    // First visit / cache cleared -- must go to network
    return _fetchAndStore(req, cache);
}

// Fetch from network, stamp with timestamp, store in cache, return to caller.
async function _fetchAndStore(req, cache) {
    try {
        const res = await fetch(req);
        if (!res || !res.ok) return res; // don't cache errors

        // Read body once, build two responses:
        //   - one with x-sw-cached-at header for the cache entry
        //   - one with original headers to return to the browser
        const body    = await res.arrayBuffer();
        const origHdr = new Headers(res.headers);
        const swHdr   = new Headers(res.headers);
        swHdr.set('x-sw-cached-at', String(Date.now()));

        await cache.put(req, new Response(body, {
            status: res.status, statusText: res.statusText, headers: swHdr
        }));

        return new Response(body, {
            status: res.status, statusText: res.statusText, headers: origHdr
        });
    } catch (_) {
        // Network failed -- fall back to whatever is cached (even if stale)
        const c = await caches.open(API_CACHE_NAME);
        return (await c.match(req)) || (await caches.match(req)) || Response.error();
    }
}

// -- Helpers -----------------------------------------------------------------
function _putCache(cacheName, req, res) {
    if (!res || res.status !== 200 || res.type === 'opaque') return;
    caches.open(cacheName).then(c => c.put(req, res));
}