/**
 * SIVA SURESH AGENCY — Animations v1
 * Interactive animation scripts adapted from Web Template samples.
 *
 * Modules:
 *  1. Logo Animation     — shimmer + breathing pulse
 *  2. 3D Card Tilt       — mouse-tracked perspective tilt on product/category cards
 *  3. Signature Button   — vertical bar injection for CliniFlex/sig buttons
 *  4. Tab Slider         — sliding indicator pill for account tabs
 *  5. Upload Zone        — animated drag-and-drop for embroidery upload
 *  6. Rating Stars       — interactive star rating with pop animation
 *  7. Share Radial       — radial share icon menu (post-order)
 *  8. Mobile Nav         — backdrop + stagger reset on close
 *  9. Admin Sidebar      — stagger entrance guard
 * 10. Micro-interactions — button ripple, wishlist heart, scroll reveal
 */

(function() {
    'use strict';

    /* ── Utility ──────────────────────────────────────────────── */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const lerp  = (a, b, t)   => a + (b - a) * t;

    /** Wait for DOM ready or run immediately if already loaded */
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    /** RAF-batched setter for CSS custom properties */
    const propQueue = new Map();
    let propRaf = null;
    function setProp(el, prop, val) {
        if (!propQueue.has(el)) propQueue.set(el, {});
        propQueue.get(el)[prop] = val;
        if (!propRaf) propRaf = requestAnimationFrame(() => {
            propQueue.forEach((props, el) => {
                for (const [k, v] of Object.entries(props)) el.style.setProperty(k, v);
            });
            propQueue.clear();
            propRaf = null;
        });
    }

    /* ──────────────────────────────────────────────────────────
       1. LOGO ANIMATION
       Add the `.ssa-anim-logo` class to every .logo-icon img
       so the CSS breathing pulse + sheen sweep applies.
    ────────────────────────────────────────────────────────── */
    function initLogoAnimation() {
        $$('.logo-icon img').forEach(img => img.classList.add('ssa-anim-logo'));
    }


    /* ──────────────────────────────────────────────────────────
       2. 3D CARD TILT EFFECT
       Inspired by style39.css glass cards that tilt in 3D.
       On desktop (hover:hover) we track the cursor over each
       card and apply a gentle rotateX/rotateY. On mouse-leave
       we spring back to zero. Touch devices are excluded.
    ────────────────────────────────────────────────────────── */
    function init3DCardTilt() {
        // Only activate on pointer-hover capable devices
        if (!window.matchMedia('(hover: hover)').matches) return;

        const MAX_TILT = 8; // degrees

        function attachTilt(card) {
            if (card._tiltBound) return;
            card._tiltBound = true;

            let animId = null;
            let targetRx = 0, targetRy = 0;
            let currentRx = 0, currentRy = 0;
            let isHovered = false;

            function animate() {
                if (!isHovered && Math.abs(currentRx) < 0.05 && Math.abs(currentRy) < 0.05) {
                    currentRx = 0; currentRy = 0;
                    setProp(card, '--rx', '0deg');
                    setProp(card, '--ry', '0deg');
                    animId = null;
                    return;
                }
                currentRx = lerp(currentRx, targetRx, 0.12);
                currentRy = lerp(currentRy, targetRy, 0.12);
                setProp(card, '--rx', currentRx.toFixed(2) + 'deg');
                setProp(card, '--ry', currentRy.toFixed(2) + 'deg');
                animId = requestAnimationFrame(animate);
            }

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width  / 2;
                const cy = rect.top  + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width  / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                targetRy =  clamp(dx * MAX_TILT, -MAX_TILT, MAX_TILT);
                targetRx = -clamp(dy * MAX_TILT, -MAX_TILT, MAX_TILT);
                // Mouse position for radial sheen (--mx, --my)
                const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
                const my = ((e.clientY - rect.top ) / rect.height * 100).toFixed(1) + '%';
                setProp(card, '--mx', mx);
                setProp(card, '--my', my);
                if (!animId) animId = requestAnimationFrame(animate);
            }, { passive: true });

            card.addEventListener('mouseenter', () => { isHovered = true; });

            card.addEventListener('mouseleave', () => {
                isHovered = false;
                targetRx = 0; targetRy = 0;
                setProp(card, '--mx', '50%');
                setProp(card, '--my', '50%');
                if (!animId) animId = requestAnimationFrame(animate);
            });
        }

        // Attach to existing cards
        $$('.shop-card, .category-tile').forEach(attachTilt);

        // Watch for dynamically added cards (product grid re-render)
        const obs = new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(n => {
                if (n.nodeType !== 1) return;
                if (n.matches?.('.shop-card, .category-tile')) attachTilt(n);
                n.querySelectorAll?.('.shop-card, .category-tile').forEach(attachTilt);
            }));
        });
        const grid = $('.shop-grid') || $('.categories-grid') || document.body;
        obs.observe(grid, { childList: true, subtree: true });
    }


    /* ──────────────────────────────────────────────────────────
       3. SIGNATURE BUTTON ANIMATION
       Adapted from style28.css — sweeping sheen on hover.
       CSS ::after pseudo-element handles the visual effect;
       JS only applies the .sig-btn class to the right elements.
       No span injection needed (old bar approach was z-index:-1
       which made bars invisible behind opaque button backgrounds).
    ────────────────────────────────────────────────────────── */
    function initSignatureButtons() {

        function markBtn(btn) {
            if (btn._sigMarked) return;
            btn._sigMarked = true;
            btn.classList.add('sig-btn');
        }

        function markAll() {
            // Explicitly declared signature buttons
            $$([
                '.btn-signature-anim',
                '.cliniflex-dropdown .btn',
                '.mega-col-signature .btn',
                '[data-sig-btn]',
            ].join(',')).forEach(markBtn);

            // Hero slide CTA buttons — first slide (CliniFlex) gets the effect
            $$('.hero-slide:first-child .btn, .hero-btns .btn-glass, .hero-btns .btn-white').forEach(markBtn);

            // CliniFlex category tile — the "Explore →" link and any btn inside
            $$('.category-tile--cliniflex .cat-tile-link, .category-tile--cliniflex .btn').forEach(markBtn);
        }

        markAll();
        // Re-run after hero slider and dynamic category tiles render
        setTimeout(markAll, 800);
        setTimeout(markAll, 2500);
    }


    /* ──────────────────────────────────────────────────────────
       4. TAB SLIDER — liquid glass pill indicator
       Inspired by style53.css iOS-glass tab component.
       We track the active tab button and set --tab-x / --tab-w
       CSS custom properties on the tab bar so the ::before
       pseudo-element slides smoothly.
    ────────────────────────────────────────────────────────── */
    function initTabSlider() {
        function attachSlider(bar) {
            if (bar._sliderBound) return;
            bar._sliderBound = true;

            function updateIndicator(btn) {
                if (!btn) return;
                const barRect = bar.getBoundingClientRect();
                const btnRect = btn.getBoundingClientRect();
                const x = (btnRect.left - barRect.left + bar.scrollLeft).toFixed(0) + 'px';
                const w = btnRect.width.toFixed(0) + 'px';
                bar.style.setProperty('--tab-x', x);
                bar.style.setProperty('--tab-w', w);
            }

            // Initialise on load
            updateIndicator($('.acct-tab-btn.active', bar));

            bar.addEventListener('click', e => {
                const btn = e.target.closest('.acct-tab-btn');
                if (btn) {
                    // Wait a tick for the .active class to be set by existing JS
                    requestAnimationFrame(() => updateIndicator(btn));
                }
            });

            // Also handle external tab activation (e.g. via script.js openOrdersTab)
            const sliderObs = new MutationObserver(() => {
                updateIndicator($('.acct-tab-btn.active', bar));
            });
            sliderObs.observe(bar, { subtree: true, attributeFilter: ['class'] });
        }

        $$('.acct-tabs-bar').forEach(attachSlider);

        // Watch for modals being inserted into DOM
        const bodyObs = new MutationObserver(() => {
            $$('.acct-tabs-bar:not([data-slider])').forEach(bar => {
                bar.dataset.slider = '1';
                attachSlider(bar);
            });
        });
        bodyObs.observe(document.body, { childList: true, subtree: true });
    }


    /* ──────────────────────────────────────────────────────────
       5. UPLOAD ZONE ANIMATION
       Adapted from style24.css modal upload component.
       Converts plain file inputs inside .emb-logo-fields into
       animated drag-and-drop zones.
    ────────────────────────────────────────────────────────── */
    function initUploadZones() {
        function buildZone(fileInput) {
            if (fileInput._zoneBuilt) return;
            fileInput._zoneBuilt = true;

            // Create wrapper zone
            const zone = document.createElement('div');
            zone.className = 'upload-zone-anim';
            zone.setAttribute('role', 'button');
            zone.setAttribute('aria-label', 'Upload file');
            zone.tabIndex = 0;

            zone.innerHTML = `
                <i class="fas fa-cloud-upload-alt upload-icon-anim"></i>
                <span class="upload-zone-label">Drag &amp; drop your file here<br>or <span style="color:var(--primary);text-decoration:underline">browse</span></span>
                <span class="upload-zone-sub">PNG, JPG, PDF — max 5 MB</span>
            `;

            // Re-parent the file input inside the zone
            fileInput.parentNode.insertBefore(zone, fileInput);
            zone.appendChild(fileInput);

            // Preview filename
            const label = $('span.upload-zone-label', zone);

            fileInput.addEventListener('change', () => {
                if (fileInput.files && fileInput.files[0]) {
                    const name = fileInput.files[0].name;
                    zone.classList.add('upload-success');
                    label.innerHTML = `<i class="fas fa-check-circle" style="color:var(--green)"></i> ${name}`;
                    setTimeout(() => zone.classList.remove('upload-success'), 600);
                }
            });

            // Drag-and-drop
            ['dragenter','dragover'].forEach(ev => {
                zone.addEventListener(ev, e => {
                    e.preventDefault();
                    zone.classList.add('drag-over');
                });
            });

            ['dragleave','dragend'].forEach(ev => {
                zone.addEventListener(ev, () => zone.classList.remove('drag-over'));
            });

            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                if (e.dataTransfer.files.length) {
                    // Transfer to the real input via DataTransfer API
                    try {
                        fileInput.files = e.dataTransfer.files;
                        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                    } catch(_) {
                        // Fallback: just show filename
                        label.textContent = e.dataTransfer.files[0].name;
                        zone.classList.add('upload-success');
                    }
                }
            });
        }

        function scanAndBuild() {
            // Target embroidery logo upload inputs
            $$('.emb-logo-fields input[type="file"], .emb-field input[type="file"]')
                .forEach(buildZone);
        }

        scanAndBuild();

        // Watch for product detail modal being opened
        const obs = new MutationObserver(scanAndBuild);
        obs.observe(document.body, { childList: true, subtree: true });
    }


    /* ──────────────────────────────────────────────────────────
       6. RATING STARS — animated interactive rating for orders
       Inspired by the star pop animation in style25.css (GSAP
       avatar morph). We adapt the concept using CSS animations
       on star icons: scale bounce on click, hover preview,
       satisfaction label.
    ────────────────────────────────────────────────────────── */
    const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

    /**
     * Build the rating UI HTML string for injection into order detail sections.
     * @param {string} orderId
     * @param {number|null} existingRating — if already rated
     */
    window.buildRatingUI = function(orderId, existingRating = null) {
        if (existingRating) {
            const stars = Array.from({length: 5}, (_, i) =>
                `<i class="fas fa-star" style="color:${i < existingRating ? '#f59e0b' : '#d1d5db'};font-size:1.2rem"></i>`
            ).join('');
            return `
            <div class="order-rating-wrap" data-order-id="${orderId}">
                <div class="order-rating-title"><i class="fas fa-star"></i> Your Rating</div>
                <div class="rating-stars-row" style="justify-content:flex-start;gap:4px;">${stars}</div>
                <span class="order-rated-badge"><i class="fas fa-check-circle"></i> Thank you for your feedback!</span>
            </div>`;
        }

        const stars = Array.from({length: 5}, (_, i) =>
            `<span class="rating-star-anim" data-value="${i+1}" role="button" aria-label="${i+1} star">&#9733;</span>`
        ).join('');

        return `
        <div class="order-rating-wrap" data-order-id="${orderId}">
            <div class="order-rating-title"><i class="fas fa-star"></i> Rate Your Order</div>
            <div class="rating-stars-row" data-order-id="${orderId}">${stars}</div>
            <div class="rating-label" data-order-id="${orderId}">Tap a star to rate</div>
            <button class="rating-submit-btn" data-order-id="${orderId}">Submit Rating</button>
        </div>`;
    };

    function initRatingStars(container = document.body) {
        // Attach handlers to newly rendered rating rows
        $$('.rating-stars-row', container).forEach(row => {
            if (row._ratingBound) return;
            row._ratingBound = true;

            const stars   = $$('.rating-star-anim', row);
            const orderId = row.dataset.orderId;
            const label   = $(`.rating-label[data-order-id="${orderId}"]`);
            const submitBtn = $(`.rating-submit-btn[data-order-id="${orderId}"]`);
            let selected  = 0;

            function highlightTo(n) {
                stars.forEach((s, i) => {
                    s.classList.toggle('hovered', i < n);
                    s.classList.toggle('selected', i < selected);
                });
            }

            function selectRating(n) {
                selected = n;
                stars.forEach((s, i) => {
                    s.classList.remove('pop', 'hovered');
                    s.classList.toggle('selected', i < n);
                    if (i < n) {
                        // Stagger the pop animation
                        setTimeout(() => {
                            s.classList.remove('pop');
                            void s.offsetWidth; // reflow
                            s.classList.add('pop');
                        }, i * 45);
                    }
                });
                if (label) {
                    label.textContent = RATING_LABELS[n] || '';
                    label.className = `rating-label star-${n}`;
                }
                if (submitBtn) submitBtn.classList.add('visible');
            }

            stars.forEach((star, i) => {
                star.addEventListener('mouseenter', () => highlightTo(i + 1));
                star.addEventListener('mouseleave', () => highlightTo(selected));
                star.addEventListener('click',      () => selectRating(i + 1));
                // Touch
                star.addEventListener('touchend', e => {
                    e.preventDefault();
                    selectRating(i + 1);
                });
            });

            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    if (!selected) return;
                    submitRating(orderId, selected, submitBtn);
                });
            }
        });
    }

    async function submitRating(orderId, rating, btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting…';

        try {
            // Persist to Supabase if available
            if (window._supabase) {
                await window._supabase
                    .from('orders')
                    .update({ rating, rating_at: new Date().toISOString() })
                    .eq('id', orderId);
            } else if (window.db && window.db.updateRating) {
                await window.db.updateRating(orderId, rating);
            }
        } catch (err) {
            console.warn('[Rating] Save failed:', err);
        }

        // Replace the whole rating block with a "thank you"
        const wrap = btn.closest('.order-rating-wrap');
        if (wrap) {
            wrap.innerHTML = `
                <div class="order-rating-title"><i class="fas fa-star"></i> Your Rating</div>
                <div class="rating-stars-row" style="justify-content:flex-start;gap:4px;">
                    ${Array.from({length:5},(_,i)=>`<i class="fas fa-star" style="color:${i<rating?'#f59e0b':'#d1d5db'};font-size:1.2rem"></i>`).join('')}
                </div>
                <span class="order-rated-badge"><i class="fas fa-check-circle"></i> Thank you for your feedback!</span>
            `;
        }
    }

    // Public: call after order list is re-rendered
    window.SSAAnims = window.SSAAnims || {};
    window.SSAAnims.initRatingStars = initRatingStars;


    /* ──────────────────────────────────────────────────────────
       7. SHARE RADIAL MENU
       Adapted from style27.css circular expanding icon menu.
       Builds the share menu after an order is placed and
       injects it into the order success / account order section.
    ────────────────────────────────────────────────────────── */
    const SHARE_ITEMS = [
        { cls: 'share-whatsapp', icon: 'fab fa-whatsapp',  label: 'WhatsApp',  href: d => `https://wa.me/?text=${encodeURIComponent(d)}` },
        { cls: 'share-instagram', icon: 'fab fa-instagram', label: 'Instagram', href: _ => 'https://www.instagram.com/' },
        { cls: 'share-facebook',  icon: 'fab fa-facebook-f',label: 'Facebook',  href: d => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(d)}` },
        { cls: 'share-twitter',   icon: 'fab fa-x-twitter', label: 'X',         href: d => `https://twitter.com/intent/tweet?text=${encodeURIComponent(d)}` },
        { cls: 'share-youtube',   icon: 'fab fa-youtube',   label: 'YouTube',   href: _ => 'https://www.youtube.com/' },
    ];

    /**
     * Build and return the post-order share card HTML string.
     * @param {string} orderRef — short order reference for share text
     */
    window.buildShareCard = function(orderRef = '') {
        const shareText = `I just ordered premium hospital uniforms from Siva Suresh Agency! 🏥 Quality medical wear delivered to your door. ${orderRef ? `Order #${orderRef}` : ''} Check them out: ${window.location.origin}`;
        const total = SHARE_ITEMS.length;

        const items = SHARE_ITEMS.map((item, i) => `
            <li class="${item.cls}" style="--i:${i+1};--total:${total};">
                <a href="${item.href(shareText)}" target="_blank" rel="noopener" data-label="${item.label}"
                   style="--i:${i+1};--total:${total};" aria-label="Share on ${item.label}">
                    <i class="${item.icon}"></i>
                </a>
            </li>`).join('');

        return `
        <div class="post-order-share">
            <h4>Share the joy! 🎉</h4>
            <p>Tell your friends about your new order</p>
            <div class="share-radial" style="--total:${total}">
                <button class="share-toggle" aria-label="Share" aria-expanded="false">
                    <i class="fas fa-share-alt"></i>
                </button>
                <ul>${items}</ul>
            </div>
        </div>`;
    };

    function initShareMenus(container = document.body) {
        $$('.share-toggle', container).forEach(btn => {
            if (btn._shareBound) return;
            btn._shareBound = true;
            const menu = btn.closest('.share-radial');

            btn.addEventListener('click', e => {
                e.stopPropagation();
                const open = menu.classList.toggle('open');
                btn.setAttribute('aria-expanded', open);
            });
        });

        // Close on outside click
        document.addEventListener('click', () => {
            $$('.share-radial.open').forEach(m => {
                m.classList.remove('open');
                const t = $('.share-toggle', m);
                if (t) t.setAttribute('aria-expanded', 'false');
            });
        }, { capture: true, passive: true });
    }

    window.SSAAnims.initShareMenus = initShareMenus;
    window.SSAAnims.buildShareCard = window.buildShareCard;


    /* ──────────────────────────────────────────────────────────
       8. MOBILE NAV — backdrop + animation reset
       The nav-links redesign uses CSS animations on li items.
       When the menu closes and re-opens, we must reset the
       animation so it replays. We also manage the backdrop.
    ────────────────────────────────────────────────────────── */
    function initMobileNav() {
        const hamburger  = $('#hamburger');
        const navLinks   = $('#navLinks');
        if (!hamburger || !navLinks) return;

        // Create backdrop element
        let backdrop = document.createElement('div');
        backdrop.className = 'mobile-nav-backdrop';
        document.body.appendChild(backdrop);

        function openMenu() {
            backdrop.style.display = 'block';
            // Reset animations on li items so they replay
            $$('li', navLinks).forEach(li => {
                li.style.animation = 'none';
                void li.offsetWidth; // force reflow
                li.style.animation = '';
            });
            requestAnimationFrame(() => backdrop.classList.add('visible'));
        }

        function closeMenu() {
            backdrop.classList.remove('visible');
            setTimeout(() => { backdrop.style.display = 'none'; }, 300);
        }

        // Observe hamburger active class changes
        const obs = new MutationObserver(() => {
            if (hamburger.classList.contains('active')) openMenu();
            else closeMenu();
        });
        obs.observe(hamburger, { attributeFilter: ['class'] });

        // Close when backdrop is clicked
        backdrop.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            closeMenu();
        });
    }


    /* ──────────────────────────────────────────────────────────
       9. ADMIN SIDEBAR
       CSS handles the stagger entrance via nth-child delays +
       animation-fill-mode: forwards. The old JS reset was
       clearing animations at 700ms — BEFORE the last items
       finished (delay 0.50s + duration 0.55s = 1.05s total),
       which made the animation invisible. Removed entirely.
    ────────────────────────────────────────────────────────── */
    function initAdminSidebar() {
        const sidebar = $('.sidebar');
        if (!sidebar) return;
        // CSS animation with forwards fill-mode holds the final state.
        // No JS reset needed — hover transitions still work fine
        // because CSS specificity on :hover rules overrides the fill.
    }


    /* ──────────────────────────────────────────────────────────
       10. MICRO-INTERACTIONS
       Button ripple, wishlist heart, and enhanced hover effects.
    ────────────────────────────────────────────────────────── */

    /** Ripple effect on button click */
    function createRipple(e, btn) {
        const existing = btn.querySelector('.btn-ripple');
        if (existing) existing.remove();

        const rect   = btn.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height) * 2;
        const x      = e.clientX - rect.left - size / 2;
        const y      = e.clientY - rect.top  - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.cssText = `
            position:absolute;width:${size}px;height:${size}px;
            top:${y}px;left:${x}px;
            border-radius:50%;
            background:rgba(255,255,255,0.22);
            transform:scale(0);pointer-events:none;
            animation:btn-ripple-anim 0.55s cubic-bezier(0.4,0,0.2,1) forwards;
        `;
        btn.style.position = btn.style.position || 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    function initRippleEffect() {
        // Inject keyframe once
        if (!document.getElementById('ssa-ripple-style')) {
            const s = document.createElement('style');
            s.id = 'ssa-ripple-style';
            s.textContent = '@keyframes btn-ripple-anim { to { transform:scale(1); opacity:0; } }';
            document.head.appendChild(s);
        }
        document.addEventListener('click', e => {
            const btn = e.target.closest('.btn');
            if (btn) createRipple(e, btn);
        }, { passive: true });
    }

    /** Wishlist heart pulse when clicked */
    function initWishlistAnim() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('.shop-card-wishlist');
            if (!btn) return;
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.animation = 'none';
                void icon.offsetWidth;
                icon.style.animation = '';
            }
        }, { passive: true });
    }

    /** Smooth scroll for in-page anchor links */
    function initSmoothAnchor() {
        document.addEventListener('click', e => {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, { passive: false });
    }

    /** Animate stat numbers when they come into view */
    function initStatCounters() {
        const stats = $$('.stat-number');
        if (!stats.length) return;

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || entry.target._counted) return;
                entry.target._counted = true;
                const raw     = entry.target.textContent.replace(/[^0-9.]/g, '');
                const end     = parseFloat(raw);
                const suffix  = entry.target.textContent.replace(/[\d.]/g, '');
                const dur     = 1600;
                const start   = performance.now();

                function tick(now) {
                    const t   = Math.min(1, (now - start) / dur);
                    const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
                    const val  = (ease * end);
                    entry.target.textContent = (Number.isInteger(end) ? Math.round(val) : val.toFixed(1)) + suffix;
                    if (t < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.5 });

        stats.forEach(s => obs.observe(s));
    }


    /* ──────────────────────────────────────────────────────────
       INIT — run all modules
    ────────────────────────────────────────────────────────── */
    ready(function() {
        initLogoAnimation();
        init3DCardTilt();
        initSignatureButtons();
        initTabSlider();
        initUploadZones();
        initRatingStars();
        initShareMenus();
        initMobileNav();
        initAdminSidebar();
        initRippleEffect();
        initWishlistAnim();
        initSmoothAnchor();
        initStatCounters();
    });

})();
