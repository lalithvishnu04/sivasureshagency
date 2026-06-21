PWA & TTI Improvements Checklist

- [ ] Add a Web App Manifest (`manifest.json`) with `name`, `short_name`, `start_url`, `icons` (include maskable), `display`, and `theme_color`.
- [ ] Add `<link rel="manifest" href="/manifest.json">` in all pages and a `<meta name="theme-color" content="#HEX">` tag.
- [ ] Register a basic service worker to cache shell assets and provide offline fallback; ensure `start_url` is controlled.
- [ ] Serve all assets over HTTPS (GitHub Pages does this) and set appropriate caching headers.
- [ ] Defer non-critical JS with `defer` or `async`; move heavy initialization into `requestIdleCallback` or `DOMContentLoaded` handlers.
- [ ] Split large scripts: move non-essential UI (e.g., analytics, widgets) into dynamic imports or separate chunks.
- [ ] Preload critical font(s) and LCP-critical images: `<link rel="preload" as="font" href="..." type="font/woff2" crossorigin>` and `<link rel="preload" as="image" href="...">` for LCP image.
- [ ] Reduce main-thread work: avoid long synchronous loops; throttle expensive event handlers; defer expensive DOM reads/writes.
- [ ] Use efficient image formats/WebP and proper `srcset` (already implemented); ensure correct `width`/`height` attributes to avoid layout shifts.
- [ ] Remove unused JS and CSS (tree-shake / purge) and compress/minify assets.
- [ ] Ensure server responds with small initial HTML and critical CSS inlined if necessary to reduce render-blocking.

Quick action plan to reduce TTI

1. Audit `js/script.js` for long tasks; lazy-init non-critical features (particles, analytics, modals) after `load`.
2. Add `defer` to script includes (already applied) and move inline initialization into `DOMContentLoaded` callbacks.
3. Preload LCP image and main font(s).
4. Replace any synchronous JSON parsing/large data loops with incremental processing (chunking via setTimeout).
5. Re-run Lighthouse and iterate on the top opportunities.
