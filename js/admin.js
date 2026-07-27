// SSA Admin v67 — Dashboard, categories, products, inventory, orders, customers
// db, auth, fsServerTimestamp, fsIncrement are set by js/db-init.js

// ===== Help Panel Toggle =====
function toggleHelpPanel() {
    const panel = document.getElementById('helpPanel');
    const content = document.getElementById('helpContent');
    const arrow = document.getElementById('helpArrow');
    
    if (panel && content && arrow) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        arrow.style.transition = 'transform 0.3s ease';
    }
}

// ===== State =====
let currentOrderFilter = 'all';
let allOrders = [];
let allProducts = [];
let allInventory = [];
let allCustomers = [];

// ===== In-memory cache (90s TTL) — prevents repeated Supabase reads =====
const _cache = {};
const _CACHE_TTL = 90_000;
async function _cachedGet(name, queryFn) {
    const now = Date.now();
    if (_cache[name] && (now - _cache[name].ts) < _CACHE_TTL) return _cache[name].data;
    const snap = await queryFn();
    _cache[name] = { data: snap, ts: now };
    return snap;
}
function _invalidateCache(...names) {
    names.forEach(n => { if (_cache[n]) _cache[n].ts = 0; });
}

// Tells the public site (script.js) that products changed, so it re-fetches
// fresh data on the next page load instead of trusting a not-yet-expired cache.
function _markProductsDirty() {
    try { localStorage.setItem('_ssa_products_dirty', String(Date.now())); } catch (e) { /* ignore */ }
}

// ===== API helper — use backend API when available, else Supabase =====
// For admin reads we use the API; writes always go direct to Supabase.
async function _adminApiOr(apiMethod, supabaseFn) {
    if (window.ssaApi && window.ssaApi.enabled) {
        try { return await window.ssaApi[apiMethod](); }
        catch (e) { console.warn('[admin-api] falling back to Supabase:', e.message); }
    }
    return supabaseFn();
}

// ===== Wait for Supabase to initialize =====
let authInitAttempts = 0;
function initializeAuthListener() {
    authInitAttempts++;
    console.log(`[admin.js] Init attempt ${authInitAttempts}:`, {
        _ready: typeof window._dbReady,
        auth: typeof window.auth,
        db: typeof window.db
    });
    
    if (typeof auth === 'undefined' || !auth || !(window._dbReady || window._firebaseReady)) {
        if (authInitAttempts > 100) {
            const loginErr = document.getElementById('loginError');
            if (loginErr) loginErr.textContent = 'Backend initialization failed. Please refresh the page.';
            return;
        }
        setTimeout(initializeAuthListener, 50);
        return;
    }
    auth.onAuthStateChanged(user => {
        // Only treat as admin if user has an email (not anonymous)
        if (user && user.email) {
            showAdminPanel(user);
        } else {
            // No user, or anonymous user - show login screen
            if (user && !user.email) {
                auth.signOut();
            }
            showLoginScreen();
        }
    });
}

// Show the admin dashboard for a signed-in user
function showAdminPanel(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    const name = (user.email || 'admin').split('@')[0];
    document.getElementById('adminName').textContent = name;
    if (document.getElementById('adminNameTop')) document.getElementById('adminNameTop').textContent = name;
    const av = document.getElementById('sidebarAvatar');
    if (av) av.textContent = name.charAt(0).toUpperCase();
    // Restore sidebar collapsed state from previous session
    restoreSidebarCollapseState();
    // Wait for the DB layer to be ready before loading data
    waitForDbThenLoad();
}
// Show the login screen
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}
// Wait for window.db to be ready then load dashboard
function waitForDbThenLoad(attempts) {
    attempts = attempts || 0;
    if (window.db && window._dbReady) {
        console.log('[admin.js] Supabase ready — loading dashboard');
        loadDashboard();
        // Refresh the category list from Supabase up-front so the product
        // category dropdown reflects live categories even before the Categories
        // tab is opened.
        if (typeof loadTaxonomy === 'function') { try { loadTaxonomy(true); } catch (e) { /* ignore */ } }
    } else if (attempts > 60) {
        console.error('[admin.js] Supabase not ready after 3s');
        showAdminToast('Database connection failed. Please refresh.', 'error');
    } else {
        setTimeout(() => waitForDbThenLoad(attempts + 1), 50);
    }
}

// Start listening for auth changes
initializeAuthListener();

function handleAdminLogin(e) {
    e.preventDefault();
    if (typeof auth === 'undefined' || !auth || !(window._dbReady || window._firebaseReady)) {
        showLoginError('Backend is still loading — please wait a moment and try again.');
        return;
    }
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const btn = document.getElementById('loginBtn');
    showLoginError('');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    const resetBtn = () => { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In to Dashboard'; };

    auth.signInWithEmailAndPassword(email, password)
        .then(data => {
            resetBtn();
            if (data && data.session) {
                showLoginError('');
                showAdminPanel(data.user || data.session.user || { email });
            } else if (data && data.user && !data.session) {
                // Account exists but no session — email not yet confirmed
                showLoginError(
                    'Your email is not confirmed. ' +
                    'Go to Supabase → Authentication → Sign In / Providers → Email → ' +
                    'click Enable → turn OFF "Confirm email" → Save. Then try again.',
                    true
                );
            } else {
                showLoginError('Sign-in failed — no session returned. Please try again.');
            }
        })
        .catch(err => {
            resetBtn();
            const m = (err.message || '').toLowerCase();
            if (m.includes('provider') && (m.includes('not enabled') || m.includes('disabled'))) {
                showLoginError(
                    '⚠️ Email sign-in is DISABLED in Supabase. ' +
                    'Go to: Supabase Dashboard → Authentication → Sign In / Providers → ' +
                    'click "Email" → flip the toggle to ENABLED → ' +
                    'turn OFF "Confirm email" → Save. Then refresh this page and try again.',
                    true
                );
            } else if (m.includes('not confirmed') || m.includes('email not')) {
                showLoginError(
                    'Email not confirmed. Go to Supabase → Authentication → Sign In / Providers → ' +
                    'Email → Enable it → turn OFF "Confirm email" → Save.',
                    true
                );
            } else if (m.includes('invalid') || m.includes('credentials') || m.includes('password')) {
                showLoginError('Invalid email or password. Check your credentials and try again.');
            } else {
                showLoginError('Error: ' + (err.message || 'Sign-in failed'));
            }
        });
}
function showLoginError(msg, isHtml) {
    const el = document.getElementById('loginError');
    if (!el) return;
    if (!msg) { el.innerHTML = ''; el.style.display = 'none'; return; }
    el.style.display = 'block';
    if (isHtml) el.innerHTML = msg; else el.textContent = msg;
}

function handleAdminLogout() {
    auth.signOut();
}



// ===== Navigation =====
function navigateTo(page) {
    const item = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (item) item.click();
}
window.navigateTo = navigateTo;

// ===== Unsaved changes guard =====
let _adminUnsaved = false;
function _setUnsaved(v) { _adminUnsaved = v; }
window._setUnsaved = _setUnsaved;

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;

        // Warn if there are unsaved changes
        if (_adminUnsaved) {
            if (!confirm('You have unsaved changes. Leave without saving?')) return;
            _adminUnsaved = false;
        }

        // If already on Orders and in detail view — go back to list and reload
        if (page === 'orders') {
            const detailView = document.getElementById('adminOrdersDetailView');
            const listView  = document.getElementById('adminOrdersListView');
            if (detailView && detailView.style.display !== 'none') {
                listView.style.display = '';
                detailView.style.display = 'none';
            }
        }

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + page).classList.add('active');
        document.getElementById('pageTitle').textContent = item.textContent.trim();
        if (page === 'orders') loadOrders();
        if (page === 'products') loadProducts();
        if (page === 'categories') { loadTaxonomy(); }
        if (page === 'inventory') loadInventory();
        if (page === 'customers') loadCustomers();
        if (page === 'messages') { loadMessages(); _startAdminMsgsRealtime(); loadLiveAgentToggle(); } else { _stopAdminMsgsRealtime(); }
        if (page === 'dashboard') loadDashboard();
        if (page === 'settings') { if (typeof loadWebhookSettings === 'function') loadWebhookSettings(); }
        // Update subtitle
        const subtitles = {dashboard:'Overview & analytics',orders:'Manage customer orders',products:'Product catalogue',categories:'Add & remove shop categories',inventory:'Stock levels',customers:'Registered users',messages:'Contact form submissions',settings:'Site configuration'};
        const sub = document.getElementById('pageSubtitle');
        if (sub) { const n = document.getElementById('adminNameTop')?.textContent||'Admin'; sub.innerHTML = (subtitles[page]||page)+', <span id="adminNameTop">'+n+'</span>'; }
        // Close sidebar on mobile
        if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
    });
});

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ── Sidebar collapse / expand (desktop) ─────────────────────────
// Inspired by style35.css pattern: toggles between 248px and 68px
// icon-only mode. State persists in localStorage.
function toggleSidebarCollapse() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const isNowCollapsed = sidebar.classList.toggle('collapsed');
    try { localStorage.setItem('ssa_sidebar_collapsed', isNowCollapsed ? '1' : '0'); } catch(_) {}
}

// Restore sidebar collapsed state after login renders the panel
function restoreSidebarCollapseState() {
    try {
        if (localStorage.getItem('ssa_sidebar_collapsed') === '1') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('collapsed');
        }
    } catch(_) {}
}
window.toggleSidebarCollapse = toggleSidebarCollapse;
window.restoreSidebarCollapseState = restoreSidebarCollapseState;

// ===== Dashboard =====
async function loadDashboard() {
    try {
        // ── Try backend API (1 HTTP call vs 4 Supabase reads) ──
        if (window.ssaApi && window.ssaApi.enabled) {
            try {
                const d = await window.ssaApi.adminDashboard();
                _renderDashboard(d.totalOrders, d.pending, d.revenue, d.customers, d.unreadMsgs, d.recentOrders || [], d.stockAlerts || []);
                const aovEl = document.getElementById('statAov');
                const repeatEl = document.getElementById('statRepeatRate');
                const topEl = document.getElementById('statTopProduct');
                if (aovEl) aovEl.textContent = d?.analytics?.aov ? ('\u20b9' + Number(d.analytics.aov).toLocaleString()) : '\u20b9-';
                if (repeatEl) repeatEl.textContent = d?.analytics?.repeatRate ? (Number(d.analytics.repeatRate) + '%') : '-';
                if (topEl) topEl.textContent = d?.analytics?.topProduct || '-';
                return;
            } catch (e) { console.warn('[dashboard] API failed, using Supabase:', e.message); }
        }

        // ── Sequential Supabase fallback (fresh fetch — no cache for dashboard stats) ────────
        const ordersSnap    = await db.collection('orders').get();
        const customersSnap = await _cachedGet('customers', () => db.collection('customers').get());
        const invSnap       = await db.collection('inventory').get();
        const messagesSnap  = await _cachedGet('messages',  () => db.collection('messages').get());

        const orders     = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const unreadMsgs = messagesSnap.docs.filter(d => !d.data().read).length;
        const invDocs    = invSnap.docs.map(d => d.data());

        // Load active product names fresh if allProducts not yet populated
        let activeProductNames = allProducts.map(p => (p.name || '').trim()).filter(Boolean);
        if (!activeProductNames.length) {
            try {
                const prodSnap = await _cachedGet('products', () => db.collection('products').get());
                activeProductNames = prodSnap.docs
                    .map(d => d.data())
                    .filter(p => !p.deleted && p.isActive !== false)
                    .map(p => (p.name || '').trim())
                    .filter(Boolean);
            } catch (e) { console.warn('[dashboard] products fetch failed:', e.message); }
        }
        const activeNames = new Set(activeProductNames);
        const filteredInv = activeNames.size > 0
            ? invDocs.filter(i => activeNames.has((i.productName || '').trim()))
            : invDocs;
        const alerts     = filteredInv.filter(i => { const st = i.status || (i.quantity === 0 ? 'out_of_stock' : i.quantity <= 10 ? 'low_stock' : 'in_stock'); return st !== 'in_stock'; })
                                   .map(i => { const st = i.status || (i.quantity === 0 ? 'out_of_stock' : i.quantity <= 10 ? 'low_stock' : 'in_stock'); return { productName: i.productName, size: i.size, color: i.color, status: st }; });

        // Deduplicate alerts (show per-product, not per-size)
        const seenAlerts = new Set();
        const uniqueAlerts = alerts.filter(a => {
            const key = a.productName;
            if (seenAlerts.has(key)) return false;
            seenAlerts.add(key);
            return true;
        });

        const recent     = orders.slice().sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 5);
        // Pending = orders not yet delivered or cancelled (case-insensitive check)
        const pendingStatuses = ['processing', 'approved', 'packed', 'shipped'];
        const pendingCount = orders.filter(o => pendingStatuses.includes((o.status || '').toLowerCase())).length;

        _renderDashboard(
            orders.length,
            pendingCount,
            orders.filter(o => (o.status || '').toLowerCase() !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0),
            customersSnap.size,
            unreadMsgs,
            recent,
            uniqueAlerts
        );

        const nonCancelled = orders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
        const aov = nonCancelled.length ? Math.round(nonCancelled.reduce((s, o) => s + (o.total || 0), 0) / nonCancelled.length) : 0;
        const byEmail = new Map();
        for (const o of nonCancelled) {
            const key = (o.customerEmail || '').trim().toLowerCase();
            if (!key) continue;
            byEmail.set(key, (byEmail.get(key) || 0) + 1);
        }
        const repeatCount = [...byEmail.values()].filter(c => c > 1).length;
        const repeatRate = byEmail.size ? Math.round((repeatCount / byEmail.size) * 100) : 0;
        const productQty = new Map();
        for (const o of nonCancelled) {
            for (const item of (o.items || [])) {
                const rawName = (item.name || 'Unknown').trim();
                // Normalize to current product name (handles renames like "Doctor Uniform - Full Sleeve" → "Doctor Uniform")
                const currentName = activeProductNames.find(n => n === rawName || rawName.startsWith(n + ' ') || rawName.startsWith(n + '-') || rawName.startsWith(n + '\u2013')) || rawName;
                productQty.set(currentName, (productQty.get(currentName) || 0) + (item.qty || 0));
            }
        }
        let topProduct = '-';
        let topQty = 0;
        for (const [name, qty] of productQty.entries()) {
            if (qty > topQty) { topQty = qty; topProduct = name; }
        }

        const aovEl = document.getElementById('statAov');
        const repeatEl = document.getElementById('statRepeatRate');
        const topEl = document.getElementById('statTopProduct');
        if (aovEl) aovEl.textContent = '\u20b9' + aov.toLocaleString();
        if (repeatEl) repeatEl.textContent = repeatRate + '%';
        if (topEl) topEl.textContent = topProduct;
    } catch (err) { console.error('Dashboard error:', err); }
}

function _renderDashboard(totalOrders, pending, revenue, customers, unreadMsgs, recentOrders, stockAlerts) {
    document.getElementById('statTotalOrders').textContent = totalOrders;
    document.getElementById('statPending').textContent     = pending;
    document.getElementById('statRevenue').textContent     = '\u20b9' + revenue.toLocaleString();
    document.getElementById('statCustomers').textContent   = customers;
    document.getElementById('statMessages').textContent    = unreadMsgs;
    const badge = document.getElementById('msgBadge');
    if (badge) { badge.textContent = unreadMsgs; badge.style.display = unreadMsgs > 0 ? 'inline' : 'none'; }

    // Recent orders
    const recentHtml = recentOrders.length ? recentOrders.map(o => `
        <div class="list-item">
            <div class="list-item-info">
                <strong>#${o.orderId || (o.docId || '').slice(0, 8)}</strong>
                <span>${o.customerName || 'Guest'} &bull; ${o.createdAt ? new Date(o.createdAt.seconds*1000).toLocaleDateString('en-IN') : ''}</span>
            </div>
            <div class="list-item-right">
                <span class="amount">\u20b9${(o.total || 0).toLocaleString()}</span>
                <span class="status-badge ${(o.status || '').toLowerCase()}">${o.status}</span>
            </div>
        </div>`).join('') : '<p class="empty">No orders yet</p>';
    document.getElementById('recentOrdersList').innerHTML = recentHtml;

    // Stock alerts
    const alertHtml = stockAlerts.length ? stockAlerts.map(s => `
        <div class="list-item">
            <div class="list-item-info"><strong>${s.productName}</strong><span>Size: ${s.size}${s.color ? ' | ' + s.color : ''}</span></div>
            <div class="list-item-right"><span class="status-badge ${s.status === 'out_of_stock' ? 'cancelled' : 'processing'}">${s.status === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}</span></div>
        </div>`).join('') : '<p class="empty">All stock levels OK \u2705</p>';
    document.getElementById('lowStockList').innerHTML = alertHtml;
}

// ===== Orders =====
async function loadOrders() {
    const grid = document.getElementById('adminOrdersGrid');
    try {
        const data = await _adminApiOr('adminOrders',
            () => _cachedGet('orders', () => db.collection('orders').get()).then(snap => {
                const docs = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
                docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                return docs;
            })
        );
        allOrders = Array.isArray(data) ? data : data.docs.map(d => ({ docId: d.id, ...d.data() }));
        allOrders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        _updateOrderStats();
        renderOrders();
    } catch (err) {
        console.error('Orders error:', err);
        if (grid) grid.innerHTML = '<div class="admin-orders-empty" style="color:red"><i class="fas fa-exclamation-triangle"></i><p>Failed to load orders.<br><small>' + err.message + '</small></p></div>';
    }
}

function _updateOrderStats() {
    const total = allOrders.length;
    const pending = allOrders.filter(o => ['processing','approved','packed'].includes((o.status||'').toLowerCase())).length;
    const delivered = allOrders.filter(o => (o.status||'').toLowerCase() === 'delivered').length;
    const revenue = allOrders.filter(o => (o.status||'').toLowerCase() !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
    const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    el('statTotalOrderCount', total);
    el('statPendingCount', pending);
    el('statDeliveredCount', delivered);
    el('statOrderRevenue', '₹' + revenue.toLocaleString('en-IN'));
}

function renderOrders() {
    let filtered = currentOrderFilter === 'all' ? allOrders : allOrders.filter(o => o.status === currentOrderFilter);
    const search = (document.getElementById('orderSearch')?.value || '').toLowerCase();
    if (search) filtered = filtered.filter(o => (o.orderId || '').toLowerCase().includes(search) || (o.customerName || '').toLowerCase().includes(search) || (o.customerEmail || '').toLowerCase().includes(search));

    const grid = document.getElementById('adminOrdersGrid');
    if (!grid) return;
    if (!filtered.length) {
        grid.innerHTML = '<div class="admin-orders-empty"><i class="fas fa-box-open"></i><p>No orders found</p></div>';
        return;
    }

    grid.innerHTML = filtered.map(o => {
        const statusKey = (o.status || 'processing').toLowerCase().replace(/\s+/g, '-');
        const initials = (o.customerName || 'G').split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || 'G';
        const dateStr = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

        // Compact Return/Exchange notification badge (for refund column)
        const rr = o.returnRequest;
        const rrType = rr ? (rr.type === 'Exchange' ? 'Exch' : 'Ret') : '';
        const rrSt = rr ? (rr.status || 'Pending') : '';
        const returnBadge = rr
            ? `<span class="aob-flag aob-return ${rrSt.toLowerCase()}" title="${_escHtmlCat(rr.type||'Return')}: ${_escHtmlCat(rrSt)}"><i class="fas fa-rotate-left"></i> ${_escHtmlCat(rrType)} · ${_escHtmlCat(rrSt)}</span>`
            : '';

        // Compact Cancellation notification badge (for refund column)
        const cr = o.cancellation;
        const crSt = cr ? (cr.status || 'Pending') : '';
        const crRefund = cr ? (cr.refundStatus || '') : '';
        const cancelBadge = cr
            ? (crRefund === 'Processed'
                ? `<span class="aob-flag aob-cancel processed" title="Refund Processed" style="background:#dcfce7;color:#15803d;border-color:#86efac;"><i class="fas fa-check-circle"></i> Refund · Processed</span>`
                : crRefund === 'Initiated'
                ? `<span class="aob-flag aob-cancel initiated" title="Refund Initiated" style="background:#eff6ff;color:#1d4ed8;border-color:#93c5fd;"><i class="fas fa-clock"></i> Refund · Initiated</span>`
                : crRefund === 'Failed'
                ? `<span class="aob-flag aob-cancel failed" title="Refund Failed" style="background:#fef2f2;color:#dc2626;border-color:#fca5a5;"><i class="fas fa-exclamation-circle"></i> Refund · Failed</span>`
                : `<span class="aob-flag aob-cancel ${crSt.toLowerCase()}" title="Cancellation: ${_escHtmlCat(crSt)}"><i class="fas fa-times-circle"></i> Cancel · ${_escHtmlCat(crSt)}</span>`)
            : (o.status === 'Cancelled' ? `<span class="aob-flag aob-cancel cancelled" title="Order Cancelled"><i class="fas fa-ban"></i> Cancelled</span>` : '');

        const refundCell = (returnBadge || cancelBadge)
            ? `${returnBadge}${cancelBadge}`
            : `<span style="font-size:0.75rem;color:var(--text-light);">—</span>`;

        return `
            <div class="admin-order-row">
                <div class="admin-order-cell">
                    <span class="admin-order-id" title="#${_escHtmlCat(o.orderId || o.docId)}">#${_escHtmlCat(o.orderId || o.docId.slice(0, 14))}</span>
                </div>
                <div class="admin-order-cell">
                    <div class="admin-order-customer" title="${_escHtmlCat(o.customerEmail || '')}">
                        <div class="admin-order-avatar">${_escHtmlCat(initials)}</div>
                        <div style="min-width:0;overflow:hidden;">
                            <span class="admin-order-cust-name">${_escHtmlCat(o.customerName || 'Guest')}</span>
                            <span class="admin-order-cust-email">${_escHtmlCat(o.customerEmail || '')}</span>
                        </div>
                    </div>
                </div>
                <div class="admin-order-cell" style="text-align:center;">
                    <span class="admin-order-items-count">${(o.items || []).length}</span>
                </div>
                <div class="admin-order-cell">
                    <span class="admin-order-total-val">₹${(o.total || 0).toLocaleString('en-IN')}</span>
                </div>
                <div class="admin-order-cell">
                    <span class="admin-order-status-badge ${statusKey}">${_escHtmlCat(o.status || 'Processing')}</span>
                </div>
                <div class="admin-order-cell">${refundCell}</div>
                <div class="admin-order-cell">
                    <span style="font-size:0.8rem;color:var(--text-mid);">${dateStr}</span>
                </div>
                <div class="admin-order-cell admin-order-actions-cell">
                    <button class="admin-order-view-btn" onclick="showAdminOrderDetail('${o.docId}')"><i class="fas fa-eye"></i> View</button>
                    <button class="admin-order-inv-btn" onclick="printOrderInvoice('${o.docId}')" title="Invoice"><i class="fas fa-file-invoice"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

// Order filter buttons
document.querySelectorAll('#page-orders .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#page-orders .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentOrderFilter = btn.dataset.status;
        renderOrders();
    });
});

document.getElementById('orderSearch')?.addEventListener('input', renderOrders);

function backToOrdersList() {
    document.getElementById('adminOrdersListView').style.display = '';
    document.getElementById('adminOrdersDetailView').style.display = 'none';
}
window.backToOrdersList = backToOrdersList;

async function saveAdminOrderAddress(docId) {
    const street = document.getElementById('editAddrStreet')?.value.trim();
    const city   = document.getElementById('editAddrCity')?.value.trim();
    const pin    = document.getElementById('editAddrPin')?.value.trim();
    if (!street || !city) { showAdminToast('Street and City are required', 'error'); return; }
    const o = allOrders.find(x => x.docId === docId);
    if (!o) return;
    if (['Shipped','Delivered','Cancelled'].includes(o.status)) {
        showAdminToast('Cannot edit address after shipping', 'error'); return;
    }
    try {
        await db.collection('orders').doc(docId).update({ address: street, city, pincode: pin || o.pincode || '', updatedAt: fsServerTimestamp() });
        const idx = allOrders.findIndex(x => x.docId === docId);
        if (idx !== -1) { allOrders[idx].address = street; allOrders[idx].city = city; allOrders[idx].pincode = pin || o.pincode || ''; }
        showAdminToast('Address updated successfully');
        backToOrdersList(); loadOrders();
    } catch (err) { showAdminToast('Error: ' + err.message, 'error'); }
}
window.saveAdminOrderAddress = saveAdminOrderAddress;

function showAdminOrderDetail(docId) {
    const o = allOrders.find(x => x.docId === docId);
    if (!o) return;

    document.getElementById('adminOrdersListView').style.display = 'none';
    const detailView = document.getElementById('adminOrdersDetailView');
    detailView.style.display = 'block';

    const statuses = ['Processing','Approved','Packed','Shipped','Delivered'];
    const statusKey = (o.status || 'processing').toLowerCase().replace(/\s+/g, '-');
    const history = o.statusHistory || {};
    const curIdx = statuses.findIndex(s => s.toLowerCase() === statusKey);

    // Build timeline
    let timelineHTML = '';
    if (statusKey === 'cancelled') {
        timelineHTML = `<div class="admin-od-timeline">
            <div class="admin-tl-step done"><div class="admin-tl-dot"><i class="fas fa-check"></i></div><div class="admin-tl-label">Placed</div></div>
            <div class="admin-tl-step cancelled"><div class="admin-tl-dot"><i class="fas fa-times"></i></div><div class="admin-tl-label">Cancelled</div></div>
        </div>`;
    } else {
        const tSteps = [
            { key:'processing', label:'Placed', icon:'fa-check' },
            { key:'approved', label:'Approved', icon:'fa-thumbs-up' },
            { key:'packed', label:'Packed', icon:'fa-box' },
            { key:'shipped', label:'Shipped', icon:'fa-truck' },
            { key:'delivered', label:'Delivered', icon:'fa-home' }
        ];
        timelineHTML = '<div class="admin-od-timeline">' + tSteps.map((s, i) => {
            const cls = i < curIdx ? 'done' : i === curIdx ? 'active' : '';
            const ts = history[s.key] ? '<div class="admin-tl-date">' + new Date(history[s.key]).toLocaleDateString('en-IN') + '</div>' : '';
            return `<div class="admin-tl-step ${cls}"><div class="admin-tl-dot"><i class="fas ${s.icon}"></i></div><div class="admin-tl-label">${s.label}</div>${ts}</div>`;
        }).join('') + '</div>';
    }

    // Build items table
    const itemsHTML = (o.items || []).map(item => {
        const embroidery = item.embroidery || null;
        let embHtml = '';
        if (embroidery) {
            const lines = [];
            if (embroidery.type) lines.push('<strong>' + _escHtmlCat(embroidery.type) + '</strong>');
            if (embroidery.line1) lines.push('Line 1: ' + _escHtmlCat(embroidery.line1));
            if (embroidery.line2) lines.push('Line 2: ' + _escHtmlCat(embroidery.line2));
            if (embroidery.color) lines.push('Thread: ' + _escHtmlCat(embroidery.color));
            if (embroidery.position) lines.push('Text pos: ' + _escHtmlCat(embroidery.position));
            embHtml = `<div class="admin-od-emb-detail">${lines.join(' · ')}</div>`;
            if (embroidery.logoImage) embHtml += `<div style="margin-top:6px;"><img src="${embroidery.logoImage}" style="max-width:90px;max-height:60px;border-radius:6px;border:1px solid #e2e8f0;"><a href="${embroidery.logoImage}" download="${_escHtmlCat(embroidery.logoFileName||'logo')}" style="display:block;font-size:0.72rem;color:var(--primary);margin-top:3px;">Download</a></div>`;
        }
        return `<tr>
            <td><span class="admin-od-item-name">${_escHtmlCat(item.name || 'Item')}</span>${embHtml}</td>
            <td>${_escHtmlCat(item.selectedSize || '—')}</td>
            <td>${_escHtmlCat(item.selectedColor || '—')}</td>
            <td style="text-align:center;">${item.qty || 1}</td>
            <td style="font-weight:700;color:var(--primary);">₹${((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</td>
        </tr>`;
    }).join('');

    // Return request HTML
    const returnHTML = o.returnRequest ? `
        <div class="admin-od-card">
            <div class="admin-od-card-head"><i class="fas fa-rotate-left"></i><h4>Return/Exchange Request</h4></div>
            <div class="admin-od-card-body">
                <div class="admin-return-box">
                    <h4><i class="fas fa-rotate-left"></i> ${_escHtmlCat(o.returnRequest.type || 'Return')} — <span style="text-transform:capitalize;">${_escHtmlCat(o.returnRequest.status || 'Pending')}</span></h4>
                    <p style="font-size:0.85rem;margin-bottom:8px;"><strong>Reason:</strong> ${_escHtmlCat(o.returnRequest.reason || '—')}</p>
                    ${o.returnRequest.note ? `<p style="font-size:0.82rem;color:#6b7280;margin-bottom:8px;">${_escHtmlCat(o.returnRequest.note)}</p>` : ''}
                    <p style="font-size:0.77rem;color:#94a3b8;">Submitted: ${o.returnRequest.submittedAt ? new Date(o.returnRequest.submittedAt).toLocaleString('en-IN') : '—'}</p>
                    <div class="admin-od-edit-section" style="margin-top:10px;">
                        <label>Update Return Status</label>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                            <select id="returnStatusSelect" style="flex:1;">
                                <option value="Pending" ${(o.returnRequest.status||'Pending')==='Pending'?'selected':''}>Pending</option>
                                <option value="Processing" ${o.returnRequest.status==='Processing'?'selected':''}>Processing</option>
                                <option value="Approved" ${o.returnRequest.status==='Approved'?'selected':''}>Approved</option>
                                <option value="Rejected" ${o.returnRequest.status==='Rejected'?'selected':''}>Rejected</option>
                                <option value="Refunded" ${o.returnRequest.status==='Refunded'?'selected':''}>Refunded</option>
                            </select>
                            <label style="font-size:0.82rem;font-weight:600;display:flex;align-items:center;gap:5px;">
                                <input type="checkbox" id="refundCreditedCheck" ${o.returnRequest.refundCredited?'checked':''} style="accent-color:#0d9488;"> Refund Credited
                            </label>
                            <input type="date" id="expectedRefundDate" value="${o.returnRequest.expectedRefundDate||''}" style="flex:1;">
                        </div>
                        <div class="admin-od-edit-actions"><button class="btn-primary" onclick="saveReturnUpdate('${docId}')"><i class="fas fa-save"></i> Save</button></div>
                    </div>
                </div>
            </div>
        </div>` : '';

    // Cancellation HTML
    const cancelHTML = statusKey === 'cancelled' ? `
        <div class="admin-od-card" style="border:2px solid #ef4444;">
            <div class="admin-od-card-head" style="background:#fef2f2;"><i class="fas fa-ban" style="color:#ef4444;"></i><h4 style="color:#dc2626;">Cancellation Details</h4></div>
            <div class="admin-od-card-body">
                <div class="admin-od-edit-section">
                    <label>Reason for Cancellation</label>
                    <input type="text" id="cancelReason" value="${_escHtmlCat(o.cancellation?.reason || '')}" placeholder="Enter reason...">
                </div>
                ${(o.payment || '').toUpperCase() !== 'COD' ? `
                <div class="admin-od-edit-section">
                    <label>Refund Details</label>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">
                        <div><label>Status</label><select id="refundStatusSelect">
                            <option value="">—</option>
                            <option value="Not Initiated" ${(o.cancellation?.refundStatus||'')==='Not Initiated'?'selected':''}>Not Initiated</option>
                            <option value="Initiated" ${(o.cancellation?.refundStatus||'')==='Initiated'?'selected':''}>Initiated</option>
                            <option value="Processed" ${(o.cancellation?.refundStatus||'')==='Processed'?'selected':''}>Processed</option>
                            <option value="Failed" ${(o.cancellation?.refundStatus||'')==='Failed'?'selected':''}>Failed</option>
                        </select></div>
                        <div><label>Amount (₹)</label><input type="number" id="refundAmount" value="${_escHtmlCat(o.cancellation?.refundAmount ?? '')}" placeholder="0"></div>
                        <div><label>Ref ID</label><input type="text" id="refundRef" value="${_escHtmlCat(o.cancellation?.refundRef || '')}" placeholder="PAY123..."></div>
                        <div><label>Refund Date</label><input type="date" id="refundDate" value="${_escHtmlCat(o.cancellation?.refundDate || '')}"></div>
                    </div>
                </div>` : ''}
                <div class="admin-od-edit-section">
                    <label>Internal Note</label>
                    <input type="text" id="cancelNote" value="${_escHtmlCat(o.cancellation?.note || '')}" placeholder="Optional internal note">
                </div>
                <div class="admin-od-edit-actions">
                    <button class="btn-primary" style="background:#ef4444;border-color:#ef4444;" onclick="saveCancellationDetails('${docId}')"><i class="fas fa-save"></i> Save Cancellation</button>
                </div>
            </div>
        </div>` : '';

    detailView.innerHTML = `
        <div class="admin-od-back-bar">
            <button class="admin-od-back-btn" onclick="backToOrdersList()"><i class="fas fa-arrow-left"></i> Back to Orders</button>
            <div>
                <div class="admin-od-title">Order #${_escHtmlCat(o.orderId || docId.slice(0, 8))}</div>
                <div class="admin-od-subtitle">${o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleString('en-IN') : ''} &bull; ${_escHtmlCat(o.customerName || 'Guest')}</div>
            </div>
            <span class="admin-order-status-badge ${statusKey}" style="margin-left:auto;">${_escHtmlCat(o.status || 'Processing')}</span>
        </div>
        <div class="admin-od-layout">
            <div class="admin-od-main">
                <!-- Timeline -->
                <div class="admin-od-card">
                    <div class="admin-od-card-head"><i class="fas fa-route"></i><h4>Order Timeline</h4></div>
                    ${timelineHTML}
                </div>
                <!-- Items -->
                <div class="admin-od-card">
                    <div class="admin-od-card-head"><i class="fas fa-shopping-bag"></i><h4>Order Items</h4></div>
                    <div class="admin-od-card-body">
                        <table class="admin-od-items-table">
                            <thead><tr><th>Product</th><th>Size</th><th>Color</th><th style="text-align:center;">Qty</th><th>Price</th></tr></thead>
                            <tbody>${itemsHTML}</tbody>
                        </table>
                        <div style="text-align:right;margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-weight:800;font-size:0.95rem;color:var(--primary);">Total: ₹${(o.total || 0).toLocaleString('en-IN')}</div>
                    </div>
                </div>
                ${returnHTML}
                ${cancelHTML}
            </div>
            <div class="admin-od-aside">
                <!-- Update Order -->
                <div class="admin-od-card">
                    <div class="admin-od-card-head"><i class="fas fa-edit"></i><h4>Update Order</h4></div>
                    <div class="admin-od-card-body">
                        <div class="admin-od-edit-section">
                            <label>Order Status</label>
                            <select id="orderStatusSelect">
                                <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                <option value="Approved" ${o.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                <option value="Packed" ${o.status === 'Packed' ? 'selected' : ''}>Packed</option>
                                <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                        <div class="admin-od-edit-section">
                            <label>Tracking ID</label>
                            <input type="text" id="orderTracking" value="${_escHtmlCat(o.trackingId || '')}" placeholder="Tracking ID (optional)">
                        </div>
                        <div class="admin-od-edit-section">
                            <label>Estimated Delivery</label>
                            <input type="date" id="orderEstDelivery" value="${_escHtmlCat(o.estimatedDelivery || '')}" min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="admin-od-edit-actions">
                            <button class="btn-primary" onclick="saveOrderUpdate('${docId}')"><i class="fas fa-save"></i> Update</button>
                            <button class="btn-secondary" onclick="printOrderInvoice('${docId}')"><i class="fas fa-file-invoice"></i> Invoice</button>
                        </div>
                    </div>
                </div>
                <!-- Customer Info -->
                <div class="admin-od-card">
                    <div class="admin-od-card-head"><i class="fas fa-user"></i><h4>Customer</h4></div>
                    <div class="admin-od-card-body">
                        <div class="admin-od-info-row"><span class="admin-od-info-label">Name</span><span class="admin-od-info-value">${_escHtmlCat(o.customerName || 'N/A')}</span></div>
                        <div class="admin-od-info-row"><span class="admin-od-info-label">Email</span><span class="admin-od-info-value" style="font-size:0.78rem;">${_escHtmlCat(o.customerEmail || '—')}</span></div>
                        <div class="admin-od-info-row"><span class="admin-od-info-label">Phone</span><span class="admin-od-info-value">${_escHtmlCat(o.customerPhone || '—')}</span></div>
                    </div>
                </div>
                <!-- Shipping -->
                <div class="admin-od-card">
                    <div class="admin-od-card-head"><i class="fas fa-map-marker-alt"></i><h4>Shipping Address</h4></div>
                    <div class="admin-od-card-body">
                        ${['Shipped','Delivered','Cancelled'].includes(o.status) ? `
                        <div style="font-size:0.85rem;color:var(--text-mid);line-height:1.7;">${_escHtmlCat(o.address || 'N/A')}<br>${_escHtmlCat(o.city || '')}${o.pincode ? ' — ' + _escHtmlCat(o.pincode) : ''}</div>
                        <div style="margin-top:8px;font-size:0.75rem;color:#94a3b8;display:flex;align-items:center;gap:5px;"><i class="fas fa-lock"></i> Address is locked after shipping</div>
                        ` : `
                        <div class="admin-od-edit-section">
                            <label>Street / Door No.</label>
                            <input type="text" id="editAddrStreet" value="${_escHtmlCat(o.address || '')}" placeholder="Street address">
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                            <div class="admin-od-edit-section">
                                <label>City</label>
                                <input type="text" id="editAddrCity" value="${_escHtmlCat(o.city || '')}" placeholder="City">
                            </div>
                            <div class="admin-od-edit-section">
                                <label>PIN Code</label>
                                <input type="text" id="editAddrPin" value="${_escHtmlCat(o.pincode || '')}" placeholder="PIN">
                            </div>
                        </div>
                        <div class="admin-od-edit-actions">
                            <button class="btn-primary" onclick="saveAdminOrderAddress('${docId}')"><i class="fas fa-save"></i> Save Address</button>
                        </div>
                        `}
                    </div>
                </div>
                <!-- Payment -->
                <div class="admin-od-card">
                    <div class="admin-od-card-head"><i class="fas fa-credit-card"></i><h4>Payment</h4></div>
                    <div class="admin-od-card-body">
                        <div class="admin-od-info-row"><span class="admin-od-info-label">Method</span><span class="admin-od-info-value">${_escHtmlCat(o.payment || 'COD')}</span></div>
                        <div class="admin-od-info-row"><span class="admin-od-info-label">Status</span><span class="admin-od-info-value" style="color:${(o.paymentStatus||'').toLowerCase().includes('paid') ? '#16a34a' : '#b45309'};font-weight:600;">${_escHtmlCat(o.paymentStatus || '—')}</span></div>
                        <div class="admin-od-info-row"><span class="admin-od-info-label">Total</span><span class="admin-od-info-value" style="color:var(--primary);font-size:1rem;">₹${(o.total || 0).toLocaleString('en-IN')}</span></div>
                        ${o.razorpay && o.razorpay.paymentId ? `<div class="admin-od-info-row"><span class="admin-od-info-label">Razorpay ID</span><span class="admin-od-info-value" style="font-size:0.76rem;word-break:break-all;"><a href="https://dashboard.razorpay.com/app/payments/${_escHtmlCat(o.razorpay.paymentId)}" target="_blank" rel="noopener" style="color:var(--primary);">${_escHtmlCat(o.razorpay.paymentId)}</a></span></div>` : ''}
                        ${o.trackingId ? `<div class="admin-od-info-row"><span class="admin-od-info-label">Tracking</span><span class="admin-od-info-value" style="font-size:0.78rem;">${_escHtmlCat(o.trackingId)}</span></div>` : ''}
                        ${o.estimatedDelivery ? `<div class="admin-od-info-row"><span class="admin-od-info-label">Est. Delivery</span><span class="admin-od-info-value">${_escHtmlCat(o.estimatedDelivery)}</span></div>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}
window.showAdminOrderDetail = showAdminOrderDetail;

// Keep viewOrder as an alias for backward compatibility
function viewOrder(docId) { showAdminOrderDetail(docId); }

async function saveOrderUpdate(docId) {
    const status    = document.getElementById('orderStatusSelect').value;
    const trackingId = document.getElementById('orderTracking').value.trim();
    const estimatedDelivery = document.getElementById('orderEstDelivery')?.value?.trim() || null;
    try {
        const existingOrder = allOrders.find(x => x.docId === docId) || {};
        const updatePayload = { status, trackingId, updatedAt: fsServerTimestamp() };
        if (String(status || '').toLowerCase() === 'delivered' && !existingOrder.deliveredAt) updatePayload.deliveredAt = fsServerTimestamp();

        // Track status history timestamps: record timestamp when each status is first set
        const statusKey = String(status || '').toLowerCase().replace(/\s+/g, '');
        const existingHistory = existingOrder.statusHistory || {};
        if (!existingHistory[statusKey]) {
            updatePayload.statusHistory = { ...existingHistory, [statusKey]: new Date().toISOString() };
        }

        // Core update: status + trackingId + statusHistory
        await db.collection('orders').doc(docId).update(updatePayload);

        // Optional: estimated delivery (column may not exist yet — fails silently)
        if (estimatedDelivery) {
            try {
                await db.collection('orders').doc(docId).update({ estimatedDelivery });
            } catch (e) {
                console.warn('[admin] estimatedDelivery column missing in DB. Run tools/migration.sql to add it.', e.message);
            }
        }

        _invalidateCache('orders');
        if (window.ssaApi && window.ssaApi.enabled) window.ssaApi.invalidate('/api/admin/orders');
        // Update the in-memory order object so the view reflects the change immediately
        const idx = allOrders.findIndex(x => x.docId === docId);
        if (idx !== -1) {
            allOrders[idx].status = status;
            allOrders[idx].trackingId = trackingId;
            if (updatePayload.deliveredAt) allOrders[idx].deliveredAt = new Date().toISOString();
            if (estimatedDelivery) allOrders[idx].estimatedDelivery = estimatedDelivery;
            if (updatePayload.statusHistory) allOrders[idx].statusHistory = updatePayload.statusHistory;
        }
        showAdminToast('Order updated successfully');
        // Go back to list and reload
        backToOrdersList();
        loadOrders();
        loadDashboard();
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}

async function saveReturnUpdate(docId) {
    const returnStatus = document.getElementById('returnStatusSelect')?.value || 'Pending';
    const refundCredited = document.getElementById('refundCreditedCheck')?.checked || false;
    const expectedRefundDate = document.getElementById('expectedRefundDate')?.value?.trim() || null;
    try {
        const existingOrder = allOrders.find(x => x.docId === docId) || {};
        const existing = existingOrder.returnRequest || {};
        const updatedRequest = { ...existing, status: returnStatus, refundCredited, expectedRefundDate, adminUpdatedAt: new Date().toISOString() };
        try {
            await db.collection('orders').doc(docId).update({ returnRequest: updatedRequest });
        } catch (e) {
            console.warn('[admin] returnRequest column missing. Run migration.sql.', e.message);
        }
        const idx = allOrders.findIndex(x => x.docId === docId);
        if (idx !== -1) allOrders[idx].returnRequest = updatedRequest;
        showAdminToast('Return/Exchange status updated');
        backToOrdersList();
        loadOrders();
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}
window.saveReturnUpdate = saveReturnUpdate;

async function saveCancellationDetails(docId) {
    const reason    = document.getElementById('cancelReason')?.value?.trim() || '';
    const note      = document.getElementById('cancelNote')?.value?.trim() || '';
    const refundStatus = document.getElementById('refundStatusSelect')?.value || null;
    const refundAmount = parseFloat(document.getElementById('refundAmount')?.value || '') || null;
    const refundRef    = document.getElementById('refundRef')?.value?.trim() || null;
    const refundDate   = document.getElementById('refundDate')?.value?.trim() || null;

    const existingOrder = allOrders.find(x => x.docId === docId) || {};
    const cancellation = {
        ...(existingOrder.cancellation || {}),
        reason,
        note,
        ...(refundStatus  !== null ? { refundStatus }  : {}),
        ...(refundAmount  !== null ? { refundAmount }  : {}),
        ...(refundRef     ? { refundRef }     : {}),
        ...(refundDate    ? { refundDate }    : {}),
        updatedAt: new Date().toISOString()
    };

    try {
        await db.collection('orders').doc(docId).update({ cancellation });
        const idx = allOrders.findIndex(x => x.docId === docId);
        if (idx !== -1) allOrders[idx].cancellation = cancellation;
        showAdminToast('Cancellation details saved');
        backToOrdersList();
        loadOrders();
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}
window.saveCancellationDetails = saveCancellationDetails;

async function updateOrderStatus(docId) {
    viewOrder(docId);
}

// ===== Products =====
async function loadProducts() {
    try {
        const data = await _adminApiOr('adminProducts',
            () => _cachedGet('products', () => db.collection('products').get()).then(snap => {
                const docs = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
                docs.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                return docs;
            })
        );
        const rawProducts = Array.isArray(data) ? data : data.docs.map(d => ({ docId: d.id, ...d.data() }));
        const activeProducts = (window.ssaProductHelpers?.getVisibleProducts || ((list) => list || []))(rawProducts);
        allProducts = activeProducts;
        allProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        if (!rawProducts.length) { await autoSeedProducts(); } else { await deduplicateProducts(); renderProducts(); }
    } catch (err) { console.error('Products error:', err); }
}

async function deduplicateProducts() {
    // Use compound key: name + sleeve + subCategory so products with same name but
    // different sleeve/subCategory variants are NOT treated as duplicates.
    const seen = new Map(); // key -> docId of first seen
    const toDelete = [];
    for (const p of allProducts) {
        const key = [(p.name || '').trim(), (p.sleeve || ''), (p.subCategory || '')].join('||');
        if (seen.has(key)) {
            toDelete.push(p.docId);
        } else {
            seen.set(key, p.docId);
        }
    }
    if (toDelete.length === 0) return;
    showAdminToast(`Removing ${toDelete.length} duplicate product(s)...`, 'info');
    for (const docId of toDelete) {
        try { await db.collection('products').doc(docId).update({ deleted: true, isActive: false, updatedAt: fsServerTimestamp() }); } catch (e) { /* ignore */ }
    }
    // Rebuild allProducts without soft-deleted docs
    const deletedSet = new Set(toDelete);
    allProducts = allProducts.filter(p => !deletedSet.has(p.docId));
    showAdminToast(`Cleaned up ${toDelete.length} duplicate(s)`);
}

async function autoSeedProducts() {
    const products = getLocalProductsData();
    let count = 0;
    showAdminToast('Seeding products to Supabase...', 'info');
    for (const p of products) {
        const existing = await db.collection('products').where('name', '==', p.name).get();
        if (existing.empty) {
            await db.collection('products').add({
                name: p.name, category: p.category, price: p.price,
                oldPrice: p.oldPrice || null, gender: p.gender || null,
                sleeve: p.sleeve || null, sizes: p.sizes || [],
                description: p.description || '', image: p.image || '',
                badge: p.badge || '', totalStock: 100,
                createdAt: fsServerTimestamp()
            });
            const colors = getColorsForCategory(p.category);
            for (const size of (p.sizes || [])) {
                for (const color of colors) {
                    await db.collection('inventory').add({
                        productName: p.name, productCategory: p.category,
                        size, color, quantity: 20,
                        updatedAt: fsServerTimestamp()
                    });
                }
            }
            count++;
        }
    }
    showAdminToast(`Auto-seeded ${count} products to Supabase!`);
    const snap = await db.collection('products').orderBy('name').get();
    allProducts = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    renderProducts();
}

// Get category label from taxonomy (maps category slug to admin-defined label)
function _getAdminCategoryLabel(categorySlug) {
    const tax = _adminTax || _readCachedTax();
    if (!categorySlug || !tax) return (categorySlug || '').replace(/-/g, ' ');
    
    // First, search in taxonomy for matching category slug
    for (const heading of tax) {
        for (const cat of (heading.cats || [])) {
            if (cat.slug === categorySlug) return cat.label || categorySlug;
        }
    }
    
    // Fallback: search for matching heading slug (legacy products may use old heading slugs)
    for (const heading of tax) {
        if (heading.slug === categorySlug) return heading.label || categorySlug;
    }
    
    // Final fallback: just replace hyphens with spaces
    return (categorySlug || '').replace(/-/g, ' ');
}

function renderProducts() {
    const search = (document.getElementById('productSearch')?.value || '').toLowerCase();
    let filtered = allProducts;
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));

    const tbody = document.getElementById('productsTableBody');
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty">No products. Click "Add Product" or "Sync Products" in Inventory.</td></tr>'; return; }

    // Build stock status from allInventory (by status field, fall back to quantity)
    const stockByProduct = {};
    for (const inv of allInventory) {
        if (!stockByProduct[inv.productName]) stockByProduct[inv.productName] = 'in_stock';
        const st = _invStatus(inv);
        // Demote: out_of_stock < low_stock < in_stock (use worst status across all sizes)
        if (st === 'out_of_stock') stockByProduct[inv.productName] = 'out_of_stock';
        else if (st === 'low_stock' && stockByProduct[inv.productName] !== 'out_of_stock') stockByProduct[inv.productName] = 'low_stock';
    }

    tbody.innerHTML = filtered.map(p => {
        const worstStatus = stockByProduct[p.name] || 'in_stock';
        const stockBadge = worstStatus === 'out_of_stock' ? 'cancelled' : worstStatus === 'low_stock' ? 'processing' : 'approved';
        const stockLabel = worstStatus === 'out_of_stock' ? 'Out of Stock' : worstStatus === 'low_stock' ? 'Low Stock' : 'In Stock';
        return `        <tr>
            <td><img src="${p.image || ''}" alt="" class="product-thumb"></td>
            <td class="td-name"><strong>${p.name}</strong><small>${_getAdminCategoryLabel(p.category)}</small></td>
            <td>${p.gender ? `<span class="size-chip" style="background:#e0e7ff;color:#3730a3">${p.gender}</span>` : '-'}</td>
            <td>\u20b9${p.price}</td>
            <td>${p.badge ? `<span class="size-chip" style="background:#fef3c7;color:#92400e">${p.badge}</span>` : '-'}</td>
            <td><span class="status-badge ${stockBadge}">${stockLabel}</span></td>            <td>
                <button class="btn-icon" onclick="editProduct('${p.docId}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteProduct('${p.docId}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');
}

document.getElementById('productSearch')?.addEventListener('input', renderProducts);

function openProductModal(product = null) {
    document.getElementById('productEditId').value = product ? product.docId : '';
    document.getElementById('productModalTitle').innerHTML = product ? '<i class="fas fa-edit"></i> Edit Product' : '<i class="fas fa-plus"></i> Add Product';
    document.getElementById('pName').value = product ? product.name : '';
    // Always use fresh taxonomy so the category/subcategory dropdowns reflect the
    // latest admin category structure (fixes stale subcategory bug, Issue 4).
    if (_adminTax === null && typeof loadTaxonomy === 'function') {
        loadTaxonomy(true).then(() => {
            const _n = _findProductNode(product);
            refreshProductTaxonomy(_n.catSlug, _n.subSlug);
        });
    } else {
        const _n = _findProductNode(product);
        refreshProductTaxonomy(_n.catSlug, _n.subSlug);
    }
    document.getElementById('pPrice').value = product ? product.price : '';
    document.getElementById('pOldPrice').value = product ? product.oldPrice || '' : '';
    document.getElementById('pGender').value = product ? product.gender || '' : '';
    document.getElementById('pSleeve').value = product ? product.sleeve || '' : '';
    document.getElementById('pSizes').value = product ? (product.sizes || []).join(',') : 'S,M,L,XL,XXL,XXXL';
    document.getElementById('pDescription').value = product ? product.description || '' : '';
    document.getElementById('pBadge').value = product ? product.badge || '' : '';
    document.getElementById('pFitSizing').value = product ? product.fitSizing || '' : '';
    document.getElementById('pFabricCare').value = product ? product.fabricCare || '' : '';
    document.getElementById('pReturns').value = product ? product.returns || '' : '';
    document.getElementById('pMainImage').value = product ? product.mainImage || '' : '';
    // Show existing main image preview when editing
    const _miVal = product?.mainImage || '';
    const _miPreview = document.getElementById('mainImagePreview');
    const _miImg = document.getElementById('mainImagePreviewImg');
    if (_miVal && _miPreview && _miImg) { _miImg.src = _miVal; _miPreview.style.display = ''; }
    else if (_miPreview) { _miPreview.style.display = 'none'; }
    // Load colorVariants
    _cvData = (product?.colorVariants || []).map(cv => ({ name: cv.name || '', hex: cv.hex || '#0d9488', images: [...(cv.images || [])] }));
    renderColorVariantRows();
    // Per-size pricing: seed the draft from the product, then build rows fresh
    const _spCont = document.getElementById('sizePricingContainer');
    if (_spCont) _spCont.innerHTML = '';
    _sizePricesDraft = product && product.sizePrices ? JSON.parse(JSON.stringify(product.sizePrices)) : {};
    rebuildSizePricingRows();
    // Embroidery add-on (per type)
    const _embEnabled = product ? (product.embroideryEnabled !== undefined && product.embroideryEnabled !== null ? !!product.embroideryEnabled : (product.category === 'scrub-suits')) : false;
    const _ep = _readEmbPrices(product);
    const _embEnEl = document.getElementById('pEmbEnabled');
    if (_embEnEl) _embEnEl.checked = _embEnabled;
    const _setEmb = (id, v) => { const el = document.getElementById(id); if (el) el.value = (v === 0 || v) ? v : ''; };
    _setEmb('pEmbPriceText', _ep['TEXT']);
    _setEmb('pEmbPriceLogo', _ep['LOGO']);
    _setEmb('pEmbPriceTextLogo', _ep['TEXT & LOGO']);
    toggleEmbFields();
    openModal('productModal');
}

// Read a product's per-type embroidery prices, tolerating the legacy single-price
// shape and defaulting scrub-suits to 299.
function _readEmbPrices(product) {
    const ep = product && product.embroideryPrices;
    if (ep && typeof ep === 'object') {
        return { 'TEXT': ep['TEXT'], 'LOGO': ep['LOGO'], 'TEXT & LOGO': ep['TEXT & LOGO'] };
    }
    let legacy = '';
    if (product && product.embroideryPrice !== undefined && product.embroideryPrice !== null && product.embroideryPrice !== '') legacy = product.embroideryPrice;
    else if (product && product.category === 'scrub-suits') legacy = 299;
    return { 'TEXT': legacy, 'LOGO': legacy, 'TEXT & LOGO': legacy };
}

// ===== Per-size pricing + embroidery admin controls =====
let _sizePricesDraft = {}; // { size: { price, oldPrice } }

// Rebuild the per-size price rows from the Sizes input, preserving typed values.
function rebuildSizePricingRows() {
    const cont = document.getElementById('sizePricingContainer');
    if (!cont) return;
    cont.querySelectorAll('[data-sp-size]').forEach(row => {
        const sz = row.getAttribute('data-sp-size');
        _sizePricesDraft[sz] = {
            price: row.querySelector('[data-sp-field="price"]').value,
            oldPrice: row.querySelector('[data-sp-field="old"]').value
        };
    });
    const sizes = (document.getElementById('pSizes').value || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!sizes.length) { cont.innerHTML = '<p class="sp-empty">Enter sizes above to set per-size prices.</p>'; return; }
    cont.innerHTML = sizes.map(sz => {
        const d = _sizePricesDraft[sz] || {};
        const price = (d.price != null ? d.price : '');
        const oldP = (d.oldPrice != null ? d.oldPrice : '');
        return `<div class="sp-row" data-sp-size="${_escHtmlCat(sz)}">
            <span class="sp-size">${_escHtmlCat(sz)}</span>
            <input type="number" min="0" data-sp-field="price" placeholder="Base price" value="${_escHtmlCat(price)}">
            <input type="number" min="0" data-sp-field="old" placeholder="Old price" value="${_escHtmlCat(oldP)}">
        </div>`;
    }).join('');
}
window.rebuildSizePricingRows = rebuildSizePricingRows;

function _collectSizePrices() {
    const cont = document.getElementById('sizePricingContainer');
    const out = {};
    if (!cont) return out;
    cont.querySelectorAll('[data-sp-size]').forEach(row => {
        const sz = row.getAttribute('data-sp-size');
        const price = row.querySelector('[data-sp-field="price"]').value.trim();
        const oldP = row.querySelector('[data-sp-field="old"]').value.trim();
        if (price !== '' || oldP !== '') {
            out[sz] = {};
            if (price !== '') out[sz].price = parseInt(price);
            if (oldP !== '') out[sz].oldPrice = parseInt(oldP);
        }
    });
    return out;
}

function _collectEmbPrices() {
    const num = id => { const v = (document.getElementById(id)?.value || '').trim(); return v === '' ? 0 : Math.max(0, parseInt(v) || 0); };
    return { 'TEXT': num('pEmbPriceText'), 'LOGO': num('pEmbPriceLogo'), 'TEXT & LOGO': num('pEmbPriceTextLogo') };
}

function toggleEmbFields() {
    const on = document.getElementById('pEmbEnabled')?.checked;
    const wrap = document.getElementById('pEmbPriceWrap');
    if (wrap) wrap.style.display = on ? 'block' : 'none';
}
window.toggleEmbFields = toggleEmbFields;

function editProduct(docId) {
    const p = allProducts.find(x => x.docId === docId);
    if (p) openProductModal(p);
}

// Migrates any leftover base64 data-URLs in _cvData / mainImage to Supabase
// Storage before the DB write. Runs all uploads in PARALLEL (not sequentially)
// so large products with many color-variant images don't time out.
// Most images are already uploaded in the background on selection, so this is
// only a fallback for any that are still base64.
async function _migrateImagesBeforeSave() {
    if (!window.storage) return;
    const tasks = [];
    for (const cv of _cvData) {
        for (let i = 0; i < cv.images.length; i++) {
            if (cv.images[i] && cv.images[i].startsWith('data:')) {
                tasks.push((async (variant, index) => {
                    try {
                        const blob = await (await fetch(variant.images[index])).blob();
                        const path = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
                        await window.storage.uploadBytes(path, blob);
                        variant.images[index] = await window.storage.getDownloadURL(path);
                    } catch (e) { console.warn('[migrate-cv]', e.message); }
                })(cv, i));
            }
        }
    }
    const miEl = document.getElementById('pMainImage');
    if (miEl && miEl.value.startsWith('data:')) {
        tasks.push((async () => {
            try {
                const blob = await (await fetch(miEl.value)).blob();
                const path = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
                await window.storage.uploadBytes(path, blob);
                miEl.value = await window.storage.getDownloadURL(path);
            } catch (e) { console.warn('[migrate-main]', e.message); }
        })());
    }
    await Promise.all(tasks);
}

async function saveProduct(e) {
    e.preventDefault();
    const btn = document.querySelector('#productForm button[type=submit]');
    const _origBtn = btn ? btn.innerHTML : '';
    // 1. Wait for any in-flight background color-variant uploads to finish
    //    (images upload as they're selected, so this is usually instant).
    if (_cvUploadsPending > 0) {
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading images...'; }
        for (let i = 0; i < 1200 && _cvUploadsPending > 0; i++) {
            await new Promise(r => setTimeout(r, 50)); // up to ~60s
        }
    }
    // 2. Fallback: migrate any images still stored as base64 (parallel upload).
    if (window.storage) {
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'; }
        await _migrateImagesBeforeSave();
    }
    // 3. Guard: if Storage is unavailable and large base64 images remain, the DB
    //    write would time out — warn instead of hanging.
    const _leftoverBase64 = _cvData.some(cv => (cv.images || []).some(im => im && im.startsWith('data:')));
    if (_leftoverBase64 && !window.storage) {
        if (btn) { btn.disabled = false; btn.innerHTML = _origBtn; }
        showAdminToast('Image storage is not available. Please refresh and try again.', 'error');
        return;
    }
    if (btn) { btn.disabled = false; btn.innerHTML = _origBtn; }
    const docId = document.getElementById('productEditId').value;
    const _map = _resolveProductMapping(document.getElementById('pCategory').value, (document.getElementById('pSubCategory') && document.getElementById('pSubCategory').value) || '');
    const data = {
        name: document.getElementById('pName').value.trim(),
        // categoryNode / subCategoryNode are UI-only — not stored in Supabase schema
        category: _map.category,
        subCategory: _map.subCategory || null,
        price: parseInt(document.getElementById('pPrice').value),
        oldPrice: parseInt(document.getElementById('pOldPrice').value) || null,
        gender: _map.gender || (document.getElementById('pGender').value || null),
        sleeve: _map.sleeve || (document.getElementById('pSleeve').value || null),
        sizes: document.getElementById('pSizes').value.split(',').map(s => s.trim()).filter(Boolean),
        sizePrices: _collectSizePrices(),
        embroideryEnabled: document.getElementById('pEmbEnabled').checked,
        embroideryPrices: document.getElementById('pEmbEnabled').checked ? _collectEmbPrices() : null,
        description: document.getElementById('pDescription').value.trim(),
        // Derive primary image from first colorVariant's first image for backward compat
        image: (_cvData[0]?.images?.[0]) || '',
        mainImage: document.getElementById('pMainImage').value.trim() || null,
        colorVariants: _cvData.map(cv => ({ name: cv.name, hex: cv.hex, images: cv.images })),
        badge: document.getElementById('pBadge').value.trim(),
        fitSizing: document.getElementById('pFitSizing').value.trim(),
        fabricCare: document.getElementById('pFabricCare').value.trim(),
        returns: document.getElementById('pReturns').value.trim(),
        updatedAt: fsServerTimestamp()
    };

    try {
        if (docId) {
            // Guard: prevent renaming to a name+sleeve combo that belongs to another product
            const nameConflict = allProducts.find(p =>
                p.docId !== docId &&
                (p.name || '').trim() === data.name &&
                (p.sleeve || '') === (data.sleeve || '') &&
                (p.subCategory || '') === (data.subCategory || '')
            );
            if (nameConflict) {
                showAdminToast(`❌ A product named "${data.name}" with the same sleeve/sub-category already exists. Change the sleeve field or use a different name.`, 'error');
                if (btn) { btn.disabled = false; btn.innerHTML = _origBtn; }
                return;
            }
            // Capture old product data before update so we can sync inventory
            const oldProduct = allProducts.find(p => p.docId === docId);
            await db.collection('products').doc(docId).update(data);
            _invalidateCache('products');
            _markProductsDirty();
            // Keep inventory in sync whenever product name or sizes change
            await _syncInventoryAfterProductUpdate(oldProduct, data);
            showAdminToast('Product updated');
        } else {
            // Guard: prevent adding an exact duplicate (same name + sleeve + subCategory)
            const nameConflict = allProducts.find(p =>
                (p.name || '').trim() === data.name &&
                (p.sleeve || '') === (data.sleeve || '') &&
                (p.subCategory || '') === (data.subCategory || '')
            );
            if (nameConflict) {
                showAdminToast(`❌ A product named "${data.name}" with the same sleeve/sub-category already exists. Edit that product instead.`, 'error');
                if (btn) { btn.disabled = false; btn.innerHTML = _origBtn; }
                return;
            }
            data.createdAt = fsServerTimestamp();
            data.totalStock = 0;
            await db.collection('products').add(data);
            _invalidateCache('products');
            _markProductsDirty();
            showAdminToast('Product added');
        }
        closeModal('productModal');
        loadProducts();
    } catch (err) {
        if ((err.message || '').toLowerCase().includes('schema cache')) {
            showAdminToast('Database schema is missing new product fields. Run tools/supabase_setup.sql once in Supabase SQL Editor, then retry.', 'error');
        } else {
            showAdminToast('Error: ' + err.message, 'error');
        }
    }
}

// Sync inventory records after a product is updated.
// - Renames productName when product name changes.
// - Creates inventory entries for new sizes.
// - Does NOT delete entries for removed sizes (keeps history; admin can clean manually).
async function _syncInventoryAfterProductUpdate(oldProduct, newData) {
    if (!oldProduct || !newData) return;
    try {
        const oldName = (oldProduct.name || '').trim();
        const newName = (newData.name || '').trim();
        const newSizes = Array.isArray(newData.sizes) ? newData.sizes : [];

        if (!oldName) return;

        // Rename productName in all inventory records if name changed
        if (oldName !== newName && newName) {
            const invSnap = await db.collection('inventory').where('productName', '==', oldName).get();
            if (!invSnap.empty) {
                for (const doc of invSnap.docs) {
                    await db.collection('inventory').doc(doc.id).update({
                        productName: newName,
                        productCategory: newData.category || doc.data().productCategory,
                        updatedAt: fsServerTimestamp()
                    });
                }
            }
        }

        // Create inventory entries for any new sizes not already tracked
        if (newSizes.length) {
            const effectiveName = newName || oldName;
            const existingInvSnap = await db.collection('inventory').where('productName', '==', effectiveName).get();
            const existingSizes = new Set((existingInvSnap.empty ? [] : existingInvSnap.docs.map(d => d.data().size)));
            const colors = getColorsForCategory(newData.category || oldProduct.category || '');
            for (const size of newSizes) {
                if (!existingSizes.has(size)) {
                    // New size — create a default inventory entry
                    await db.collection('inventory').add({
                        productName: effectiveName,
                        productCategory: newData.category || oldProduct.category || '',
                        size,
                        color: colors[0] || 'Default',
                        quantity: 0,
                        status: 'out_of_stock',
                        updatedAt: fsServerTimestamp()
                    });
                }
            }
        }

        _invalidateCache('inventory');
    } catch (e) { console.warn('[inventory-sync]', e.message); /* non-fatal */ }
}

async function deleteProduct(docId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    // Capture product name before deletion so we can zero-out inventory
    const toDelete = allProducts.find(p => p.docId === docId);
    try {
        // Soft-delete: mark deleted=true so sync never re-adds this product
        await db.collection('products').doc(docId).update({ deleted: true, isActive: false, updatedAt: fsServerTimestamp() });
        _invalidateCache('products');
        _invalidateCache('inventory');
        _markProductsDirty();
        // Zero-out inventory so deleted product doesn't appear in stock reports
        if (toDelete && toDelete.name) {
            try {
                const invSnap = await db.collection('inventory').where('productName', '==', toDelete.name).get();
                if (!invSnap.empty) {
                    for (const doc of invSnap.docs) {
                        await db.collection('inventory').doc(doc.id).update({ quantity: 0, status: 'out_of_stock', updatedAt: fsServerTimestamp() });
                    }
                }
            } catch (_e) { /* non-fatal */ }
        }
        showAdminToast('Product deleted');
        loadProducts();
        loadInventory();
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}

// ===== Restore Deleted Products =====
async function showDeletedProducts() {
    try {
        const snap = await db.collection('products').get();
        const deleted = snap.docs
            .map(d => ({ docId: d.id, ...d.data() }))
            .filter(p => p.deleted === true);

        if (!deleted.length) {
            showAdminToast('No deleted products found.', 'info');
            return;
        }

        const listHtml = deleted.map(p => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #e2e8f0;">
                <img src="${p.image||''}" alt="" style="width:44px;height:44px;border-radius:8px;object-fit:cover;background:#f1f5f9;">
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:0.88rem;color:#0f172a;">${p.name}</div>
                    <div style="font-size:0.75rem;color:#64748b;">${p.category || ''} · ₹${p.price || 0}</div>
                </div>
                <button class="btn-icon" onclick="restoreProduct('${p.docId}')" title="Restore" style="background:#dcfce7;color:#16a34a;border:1px solid #86efac;"><i class="fas fa-undo"></i></button>
            </div>`).join('');

        // Inject into a modal
        let modal = document.getElementById('deletedProductsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'deletedProductsModal';
            modal.className = 'modal-overlay active';
            modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.5);display:flex;align-items:center;justify-content:center;padding:20px;';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
        <div style="background:#fff;border-radius:18px;width:100%;max-width:520px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,0.15);">
            <div style="padding:18px 20px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#0f172a,#0d9488);color:#fff;">
                <h3 style="margin:0;font-size:1rem;font-weight:800;"><i class="fas fa-trash-restore"></i> Deleted Products (${deleted.length})</h3>
                <button onclick="document.getElementById('deletedProductsModal').remove()" style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:0.85rem;"><i class="fas fa-times"></i></button>
            </div>
            <div style="overflow-y:auto;padding:0 20px;flex:1;">${listHtml}</div>
            <div style="padding:14px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;">
                <p style="font-size:0.75rem;color:#64748b;margin:0;"><i class="fas fa-info-circle" style="color:#0d9488;"></i> Restoring a product will make it visible again on the website.</p>
            </div>
        </div>`;
        modal.style.display = 'flex';
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}

async function restoreProduct(docId) {
    try {
        await db.collection('products').doc(docId).update({
            deleted: false,
            isActive: true,
            updatedAt: fsServerTimestamp()
        });
        // Restore inventory quantities
        const prodSnap = await db.collection('products').doc(docId).get && (await db.collection('products').where('deleted', '==', false).get());
        _invalidateCache('products');
        _markProductsDirty();
        showAdminToast('Product restored successfully! ✅');
        // Close modal and refresh
        document.getElementById('deletedProductsModal')?.remove();
        loadProducts();
    } catch (err) {
        showAdminToast('Error restoring: ' + err.message, 'error');
    }
}
window.showDeletedProducts = showDeletedProducts;
window.restoreProduct = restoreProduct;
// Safe to re-run: never recreates soft-deleted products, never creates duplicates.
async function syncInventoryFromProducts() {
    const btn = document.querySelector('button[onclick="syncInventoryFromProducts()"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...'; }

    const products = getLocalProductsData();
    let count = 0;
    try {
        showAdminToast('Syncing products to database...', 'info');
        for (const p of products) {
            // Fetch ALL records with this name (including soft-deleted).
            // If any record exists (active OR deleted), skip -- never recreate deleted products.
            const existing = await db.collection('products').where('name', '==', p.name).get();
            if (!existing.empty) continue;

            await db.collection('products').add({
                name: p.name,
                category: p.category,
                price: p.price,
                oldPrice: p.oldPrice || null,
                gender: p.gender || null,
                sleeve: p.sleeve || null,
                sizes: p.sizes || [],
                description: p.description || '',
                image: p.image || '',
                badge: p.badge || '',
                totalStock: 100,
                createdAt: fsServerTimestamp()
            });
            // Create inventory entries for each size -- check first to avoid duplicates
            const colors = getColorsForCategory(p.category);
            for (const size of (p.sizes || [])) {
                for (const color of colors) {
                    const invCheck = await db.collection('inventory')
                        .where('productName', '==', p.name)
                        .where('size', '==', size)
                        .get();
                    if (invCheck.empty) {
                        await db.collection('inventory').add({
                            productName: p.name,
                            productCategory: p.category,
                            size: size,
                            color: color,
                            quantity: 20,
                            status: 'in_stock',
                            updatedAt: fsServerTimestamp()
                        });
                    }
                }
            }
            count++;
        }
        showAdminToast(count > 0 ? `Synced ${count} new products!` : 'All products already up to date.');
        loadProducts();
        loadInventory();
    } catch (err) {
        console.error('Sync error:', err);
        showAdminToast('Sync failed: ' + err.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sync"></i> Sync Products'; }
    }
}
function getColorsForCategory(category) {
    const colorMap = {
        'scrub-suits': ['Ceil Blue', 'Hunter Green', 'Navy', 'Burgundy', 'Charcoal', 'Caribbean Blue', 'Black'],
        'doctor-uniform': ['White', 'Light Blue', 'Mint Green'],
        'staff-uniform': ['Blue', 'Green', 'Pink', 'Gray'],
        'bedsheets': ['White', 'Sky Blue', 'Navy Blue'],
        'hospital-linen': ['White', 'Teal', 'Green'],
        'hotel-linen': ['White', 'Ivory', 'Sky Blue']
    };
    return colorMap[category] || ['White'];
}

function getLocalProductsData() {
    // Products are now managed exclusively via Supabase Admin panel.
    // This list was the old hardcoded seed — kept empty to prevent re-seeding old products.
    // To add products, use the "Add Product" button in the Admin → Products page.
    return [];
}

// ===== Inventory =====
async function loadInventory() {
    try {
        const data = await _adminApiOr('adminInventory',
            () => _cachedGet('inventory', () => db.collection('inventory').get()).then(snap => {
                const docs = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
                docs.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
                return docs;
            })
        );
        const rawInventory = Array.isArray(data) ? data : data.docs.map(d => ({ docId: d.id, ...d.data() }));
        const activeProductNames = new Set((window.ssaProductHelpers?.getVisibleProducts || ((list) => list || []))(allProducts).map(p => (p.name || '').trim()).filter(Boolean));
        allInventory = rawInventory.filter(item => (window.ssaProductHelpers?.isInventoryItemActive || ((entry) => true))(item, Array.from(activeProductNames)));
        allInventory.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
        renderInventory();
    } catch (err) { console.error('Inventory error:', err); }
}

let _invFilter = 'all';

// Helper: derive effective status (supports both new status field + old quantity field)
function _invStatus(i) {
    if (i.status) return i.status;
    if (i.quantity === 0) return 'out_of_stock';
    if (i.quantity > 0 && i.quantity <= 10) return 'low_stock';
    return 'in_stock';
}

function setInvFilter(filter, btn) {
    _invFilter = filter;
    document.querySelectorAll('[data-inv-filter]').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderInventory();
}

function renderInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    const summary = document.getElementById('invSummary');
    if (!allInventory.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty">No inventory data. Click "Sync" to populate.</td></tr>'; return; }

    const okCount  = allInventory.filter(i => _invStatus(i) === 'in_stock').length;
    const lowCount = allInventory.filter(i => _invStatus(i) === 'low_stock').length;
    const outCount = allInventory.filter(i => _invStatus(i) === 'out_of_stock').length;

    if (summary) summary.innerHTML = `
        <div class="inv-chip total"><i class="fas fa-boxes"></i> ${allInventory.length} SKUs</div>
        <div class="inv-chip ok"><i class="fas fa-check-circle"></i> ${okCount} In Stock</div>
        <div class="inv-chip low"><i class="fas fa-exclamation-triangle"></i> ${lowCount} Low Stock</div>
        <div class="inv-chip out"><i class="fas fa-times-circle"></i> ${outCount} Out of Stock</div>
    `;

    const search = (document.getElementById('inventorySearch')?.value || '').toLowerCase();
    let items = allInventory;
    if (search) items = items.filter(i =>
        (i.productName || '').toLowerCase().includes(search) ||
        (i.size || '').toLowerCase().includes(search) ||
        (i.color || '').toLowerCase().includes(search)
    );
    if (_invFilter === 'low') items = items.filter(i => _invStatus(i) === 'low_stock');
    if (_invFilter === 'out') items = items.filter(i => _invStatus(i) === 'out_of_stock');

    if (!items.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty">No matching items.</td></tr>'; return; }

    tbody.innerHTML = items.map(i => {
        const st = _invStatus(i);
        const rowClass = st === 'out_of_stock' ? 'inv-row-out' : st === 'low_stock' ? 'inv-row-low' : 'inv-row-ok';
        return `
        <tr class="${rowClass}">
            <td class="td-name"><strong>${i.productName}</strong></td>
            <td><span class="size-chip">${i.size}</span></td>
            <td>${i.color || '<span style="color:#94a3b8">\u2014</span>'}</td>
            <td>
                <select class="inv-status-select inv-status-${st}" onchange="updateInventoryStatus('${i.docId}', this.value)">
                    <option value="in_stock"  ${st === 'in_stock'      ? 'selected' : ''}>\u2713 In Stock</option>
                    <option value="low_stock" ${st === 'low_stock'     ? 'selected' : ''}>\u26a0 Low Stock</option>
                    <option value="out_of_stock" ${st === 'out_of_stock' ? 'selected' : ''}>\u2717 Out of Stock</option>
                </select>
            </td>
        </tr>`;
    }).join('');
}

async function updateInventoryStatus(docId, status) {
    try {
        await db.collection('inventory').doc(docId).update({ status, updatedAt: fsServerTimestamp() });
        _invalidateCache('inventory');
        if (window.ssaApi && window.ssaApi.enabled) { window.ssaApi.invalidate('/api/admin/inventory'); window.ssaApi.invalidate('/api/inventory'); }
        const item = allInventory.find(i => i.docId === docId);
        if (item) { item.status = status; renderInventory(); }
        const labels = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock' };
        showAdminToast(`\u2713 Marked as ${labels[status] || status}`);
    } catch (err) {
        showAdminToast('Update failed: ' + err.message, 'error');
    }
}

function openStockModal(docId, name) {
    document.getElementById('stockDocId').value = docId;
    document.getElementById('stockProductName').textContent = name;
    const item = allInventory.find(i => i.docId === docId);
    document.getElementById('stockStatus').value = item ? _invStatus(item) : 'in_stock';
    openModal('stockModal');
}

async function saveStock(e) {
    e.preventDefault();
    const docId = document.getElementById('stockDocId').value;
    const status = document.getElementById('stockStatus').value;
    try {
        await db.collection('inventory').doc(docId).update({ status, updatedAt: fsServerTimestamp() });
        const item = allInventory.find(i => i.docId === docId);
        if (item) { item.status = status; }
        showAdminToast('Stock status updated');
        closeModal('stockModal');
        renderInventory();
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}
function exportOrdersCSV() {
    if (!allOrders.length) { showAdminToast('No orders to export', 'info'); return; }
    const rows = [['Order ID','Customer','Email','Phone','Items','Total','Status','Date','Tracking','Address','City','Pincode']];
    allOrders.forEach(o => {
        const items = (o.items || []).map(i => `${i.name} x${i.qty} (${i.selectedSize||''})`).join('; ');
        const date = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('en-IN') : '';
        rows.push([o.orderId||o.docId, o.customerName||'', o.customerEmail||'', o.customerPhone||'', items, o.total||0, o.status||'', date, o.trackingId||'', o.address||'', o.city||'', o.pincode||'']);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showAdminToast('CSV downloaded!');
}

function printOrderInvoice(docId) {
    const o = allOrders.find(x => x.docId === docId);
    if (!o) { showAdminToast('Order not found', 'error'); return; }

    const logoUrl = new URL('images/Images/SSA Logo.png', window.location.href).href;
    const invoiceDate = o.createdAt ? new Date(o.createdAt.seconds * 1000) : new Date();
    const rows = (o.items || []).map(i => {
        const qty = i.qty || 0;
        const unit = i.price || 0;
        const amount = qty * unit;
        const variant = [i.selectedSize || null, i.selectedColor || null].filter(Boolean).join(' / ');
        const emb = i.embroidery;
        let embDetails = '';
        if (emb) {
            const parts = [`<strong>Embroidery (${emb.type || 'TEXT'})</strong>`];
            if (emb.line1) parts.push(`Line 1: ${emb.line1}`);
            if (emb.line2) parts.push(`Line 2: ${emb.line2}`);
            if (emb.line3) parts.push(`Line 3: ${emb.line3}`);
            if (emb.position) parts.push(`Text Position: ${emb.position}`);
            if (emb.logoPosition) parts.push(`Logo Position: ${emb.logoPosition}`);
            if (emb.font) parts.push(`Font: ${emb.font}`);
            if (emb.color) parts.push(`Thread: ${emb.color}`);
            if (emb.logoFileName) parts.push(`Logo: ${emb.logoFileName}`);
            embDetails = `<br><small class="emb-detail">${parts.join(' &bull; ')}</small>`;
        }
        return `<tr><td>${i.name || 'Item'}${variant ? `<br><small class="variant">${variant}</small>` : ''}${embDetails}</td><td class="center">${qty}</td><td class="right">&#8377;${unit.toLocaleString('en-IN')}</td><td class="right">&#8377;${amount.toLocaleString('en-IN')}</td></tr>`;
    }).join('');

    const _invItems = o.items || [];
    const embTotal = _invItems.reduce((s, i) => s + ((i.embroidery?.price || 0) * (i.qty || 1)), 0);
    const productSubtotal = _invItems.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0) - embTotal;
    const shippingCharge = Math.max(0, (o.total || 0) - (productSubtotal + embTotal));
    const discountAmt = o.discount || 0;
    const shippingLine = [o.address, o.city, o.pincode].filter(Boolean).join(', ');
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${o.orderId || docId}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root{--teal:#0d9488;--navy:#0f172a;--muted:#64748b;--line:#e2e8f0;--bg:#f8fafc;}
        *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        body{font-family:'Segoe UI',Arial,sans-serif;color:var(--navy);margin:0;background:#eef2f7;padding:24px;}
        .print-bar{max-width:980px;margin:0 auto 16px;display:flex;justify-content:flex-end;gap:10px;}
        .print-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;border:none;border-radius:10px;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(13,148,136,0.35);transition:transform 0.2s,box-shadow 0.2s;}
        .print-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(13,148,136,0.45);}
        .sheet{max-width:980px;margin:0 auto;background:#fff;border:1px solid #dbe4ee;border-radius:18px;overflow:hidden;box-shadow:0 20px 48px rgba(15,23,42,0.12);}
        .hero{display:flex;justify-content:space-between;gap:20px;padding:22px 26px;background:linear-gradient(135deg,#0f172a 0%,#0d9488 100%);color:#fff;}
        .brand{display:flex;align-items:flex-start;gap:14px;}
        .logo{width:58px;height:58px;border-radius:12px;background:#fff;padding:6px;object-fit:contain;}
        .brand h1{margin:0;font-size:26px;line-height:1.1;}
        .brand p{margin:6px 0 0;font-size:12px;opacity:.9;line-height:1.6;}
        .meta{min-width:220px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);padding:12px 14px;border-radius:12px;}
        .meta p{margin:3px 0;font-size:13px;}
        .body{padding:22px 26px 26px;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
        .box{border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:#fff;}
        .box h3{margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);}
        .box p{margin:2px 0 0;font-size:14px;line-height:1.6;}
        table{width:100%;border-collapse:collapse;margin-top:8px;border:1px solid var(--line);border-radius:10px;overflow:hidden;}
        th,td{padding:11px 12px;border-bottom:1px solid var(--line);font-size:13.5px;vertical-align:top;}
        th{background:var(--bg);text-align:left;font-weight:700;color:#334155;}
        .center{text-align:center;}
        .right{text-align:right;}
        .variant{color:var(--muted);font-size:12px;}
        .emb-detail{color:#0d9488;font-size:11.5px;line-height:1.6;}
        .totals{width:360px;margin-left:auto;margin-top:16px;border:1px solid var(--line);border-radius:12px;padding:10px 14px;background:var(--bg);}
        .totals div{display:flex;justify-content:space-between;padding:7px 0;font-size:14px;}
        .totals .grand{font-weight:800;font-size:17px;border-top:1px dashed #c7d2df;margin-top:3px;padding-top:10px;color:var(--navy);}
        .foot{margin-top:16px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;font-size:12px;color:var(--muted);}
        @media(max-width:760px){body{padding:10px;background:#fff;}.sheet{border:none;box-shadow:none;}.hero{flex-direction:column;padding:16px;}.body{padding:16px;}.grid{grid-template-columns:1fr;}.totals{width:100%;}}
        @page{size:A4;margin:10mm;}
        @media print{
            .print-bar{display:none!important;}
            body{background:#fff!important;padding:0!important;}
            .sheet{width:190mm;max-width:190mm;margin:0 auto;box-shadow:none;border:1px solid #dbe4ee;border-radius:0;}
            .hero{padding:14px 18px;background:linear-gradient(135deg,#0f172a 0%,#0d9488 100%)!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
            .body{padding:14px 18px 18px;}
            th,td{padding:8px 10px;font-size:12.5px;}
            .totals{width:86mm;}
            .foot{font-size:11px;}
        }
    </style>
</head>
<body>
    <div class="print-bar">
        <button class="print-btn" onclick="window.print()"><i class="fas fa-print"></i> Print Invoice</button>
    </div>
    <div class="sheet">
        <div class="hero">
            <div class="brand">
                <img class="logo" src="${logoUrl}" alt="SSA Logo">
                <div>
                    <h1>Siva Suresh Agency</h1>
                    <p>PVT Towers, 37/10, Selvam Nagar, Erode - 638011<br>Phone: +91 93666 40060 | Email: info@sivasureshagency.onmicrosoft.com</p>
                </div>
            </div>
            <div class="meta">
                <p><strong>Invoice No:</strong> ${o.orderId || docId.slice(0, 8)}</p>
                <p><strong>Date:</strong> ${invoiceDate.toLocaleDateString('en-IN')}</p>
                <p><strong>Payment:</strong> ${o.payment || 'COD'}</p>
            </div>
        </div>
        <div class="body">
            <div class="grid">
                <div class="box">
                    <h3>Bill To</h3>
                    <p><strong>${o.customerName || 'Guest'}</strong></p>
                    <p>${o.customerEmail || ''}</p>
                    <p>${o.customerPhone || ''}</p>
                    <p>${shippingLine || 'Address not available'}</p>
                </div>
                <div class="box">
                    <h3>Notes</h3>
                    <p>Thank you for choosing Siva Suresh Agency.</p>
                    <p>For support, contact +91 93666 40060.</p>
                    <p>This is a computer-generated invoice.</p>
                </div>
            </div>
            <table>
                <thead>
                    <tr><th>Item</th><th class="center">Qty</th><th class="right">Unit Price</th><th class="right">Amount</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <div class="totals">
                <div><span>Product Subtotal</span><span>&#8377;${productSubtotal.toLocaleString('en-IN')}</span></div>
                ${embTotal > 0 ? `<div><span>Embroidery</span><span>&#8377;${embTotal.toLocaleString('en-IN')}</span></div>` : ''}
                ${discountAmt > 0 ? `<div style="color:#16a34a;"><span>Discount</span><span>\u2212&#8377;${discountAmt.toLocaleString('en-IN')}</span></div>` : ''}
                <div><span>Shipping</span><span>${shippingCharge > 0 ? '&#8377;' + shippingCharge.toLocaleString('en-IN') : '<span style="color:#16a34a;font-weight:700;">FREE</span>'}</span></div>
                <div class="grand"><span>Order Total</span><span>&#8377;${(o.total || 0).toLocaleString('en-IN')}</span></div>
            </div>
            <div class="foot">
                <span>Invoice generated on ${new Date().toLocaleString('en-IN')}</span>
                <span>www.sivasureshagency.com</span>
            </div>
        </div>
    </div>
</body>
</html>`;

    const w = window.open('', '_blank');
    if (!w) { showAdminToast('Popup blocked. Allow popups to print invoice.', 'error'); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
}

// ===== Deduplicate inventory (merge/delete extra copies per product+size+color) =====
async function deduplicateInventory() {
    const btn = event?.target;
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...'; }
    showAdminToast('Scanning for duplicates...', 'info');
    try {
        const snap = await db.collection('inventory').get();
        const docs = snap.docs.map(d => ({ docId: d.id, ...d.data() }));

        // Group by productName + size + (color or '')
        const groups = {};
        for (const doc of docs) {
            const key = `${doc.productName}||${doc.size}||${doc.color || ''}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(doc);
        }

        let deleted = 0;
        for (const group of Object.values(groups)) {
            if (group.length <= 1) continue;
            // Keep the doc with the LOWEST quantity (most deductions applied = most accurate)
            group.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
            const toDelete = group.slice(1);
            for (const dup of toDelete) {
                await db.collection('inventory').doc(dup.docId).delete();
                deleted++;
            }
        }

        if (deleted === 0) {
            showAdminToast('No duplicates found.', 'info');
        } else {
            showAdminToast(`Removed ${deleted} duplicate entries!`);
            await loadInventory();
        }
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-compress-alt"></i> Fix Duplicates'; }
    }
}

// ===== Reconcile inventory from all unprocessed orders =====
async function reconcileInventoryFromOrders() {
    const btn = event?.target;
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Working...'; }
    showAdminToast('Reading all orders...', 'info');
    try {
        const snap = await db.collection('orders').get();
        const pending = snap.docs.filter(d => {
            const data = d.data();
            return !data.inventoryDeducted && data.status !== 'Cancelled';
        });
        if (!pending.length) {
            showAdminToast('All orders already reconciled ✓', 'info');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-calculator"></i> Reconcile Stock'; }
            return;
        }
        let processed = 0;
        for (const doc of pending) {
            const order = doc.data();
            for (const item of (order.items || [])) {
                if (!item.name || !item.selectedSize) continue;
                const invSnap = await db.collection('inventory')
                    .where('productName', '==', item.name)
                    .where('size', '==', item.selectedSize)
                    .get();
                if (invSnap.empty) continue;
                let invDoc = invSnap.docs[0];
                if (item.selectedColor && invSnap.docs.length > 1) {
                    const m = invSnap.docs.find(d => (d.data().color || '').toLowerCase() === item.selectedColor.toLowerCase());
                    if (m) invDoc = m;
                }
                const cur = invDoc.data().quantity || 0;
                await db.collection('inventory').doc(invDoc.id).update({
                    quantity: Math.max(0, cur - (item.qty || 1)),
                    updatedAt: fsServerTimestamp()
                });
            }
            await db.collection('orders').doc(doc.id).update({ inventoryDeducted: true });
            processed++;
        }
        showAdminToast(`Reconciled ${processed} order(s). Inventory updated!`);
        await loadInventory();
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-calculator"></i> Reconcile Stock'; }
    }
}

function openStockModal(docId, name, qty) {
    document.getElementById('stockDocId').value = docId;
    document.getElementById('stockProductName').textContent = name;
    document.getElementById('stockQty').value = qty;
    openModal('stockModal');
}

async function saveStock(e) {
    e.preventDefault();
    const docId = document.getElementById('stockDocId').value;
    const qty = parseInt(document.getElementById('stockQty').value);
    try {
        await db.collection('inventory').doc(docId).update({ quantity: qty, updatedAt: fsServerTimestamp() });
        showAdminToast('Stock updated');
        closeModal('stockModal');
        loadInventory();
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}

// ===== Customers =====
async function loadCustomers() {
    const tbody = document.getElementById('customersTableBody');
    try {
        const data = await _adminApiOr('adminCustomers',
            () => _cachedGet('customers', () => db.collection('customers').get()).then(snap => {
                const docs = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
                docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                return docs;
            })
        );
        allCustomers = Array.isArray(data) ? data : data.docs.map(d => ({ docId: d.id, ...d.data() }));
        allCustomers.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        renderCustomers();
    } catch (err) {
        console.error('Customers error:', err);
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="empty" style="color:red">Error: ' + err.message + '</td></tr>';
    }
}

function renderCustomers() {
    const search = (document.getElementById('customerSearch')?.value || '').toLowerCase();
    let filtered = allCustomers;
    if (search) filtered = filtered.filter(c => (c.name || '').toLowerCase().includes(search) || (c.email || '').toLowerCase().includes(search));

    const tbody = document.getElementById('customersTableBody');
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty">No customers yet</td></tr>'; return; }

    // Compute real order counts & spend from allOrders (live, not stale customer doc)
    const ordersByEmail = new Map();
    const spendByEmail  = new Map();
    for (const o of (allOrders || [])) {
        const key = (o.customerEmail || '').trim().toLowerCase();
        if (!key) continue;
        ordersByEmail.set(key, (ordersByEmail.get(key) || 0) + 1);
        if (o.status !== 'Cancelled') spendByEmail.set(key, (spendByEmail.get(key) || 0) + (o.total || 0));
    }

    tbody.innerHTML = filtered.map(c => {
        const key = (c.email || '').trim().toLowerCase();
        const orders = ordersByEmail.get(key) ?? (c.orderCount || 0);
        const spent  = spendByEmail.get(key)  ?? (c.totalSpent  || 0);
        return `
        <tr>
            <td><strong>${c.name || 'N/A'}</strong></td>
            <td>${c.customerId ? `<span style="font-size:0.75rem;font-weight:800;color:var(--primary-teal);background:rgba(13,148,136,0.08);border-radius:6px;padding:2px 8px;letter-spacing:0.5px;">${c.customerId}</span>` : '<span style="color:var(--text-faint);font-size:0.75rem;">—</span>'}</td>
            <td>${c.email || ''}</td>
            <td>${c.phone || ''}</td>
            <td>${orders}</td>
            <td>\u20b9${spent.toLocaleString()}</td>
            <td>${c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleDateString('en-IN') : 'N/A'}</td>
        </tr>`;
    }).join('');
}

document.getElementById('customerSearch')?.addEventListener('input', renderCustomers);

// ===== Modals =====
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// Close modals on backdrop click
document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => { if (e.target === e.currentTarget) el.classList.remove('active'); });
});

// ===== Toast =====
function showAdminToast(msg, type = 'success', duration = 3000) {
    const toast = document.getElementById('adminToast');
    if (!toast) { console.log('[toast]', type, msg); return; }
    toast.textContent = msg;
    toast.className = 'admin-toast ' + type + ' show';
    if (duration > 0) setTimeout(() => toast.classList.remove('show'), duration);
}

// Show loading indicator during save operations
function showAdminLoading(show = true) {
    let loader = document.getElementById('adminSaveLoader');
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'adminSaveLoader';
            loader.innerHTML = `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:24px;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:11000;text-align:center;"><div style="width:40px;height:40px;border:4px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;"></div><p style="color:var(--text);font-weight:600;margin:0;font-size:14px;">Saving...</p></div>`;
            document.body.appendChild(loader);
        }
    } else if (loader) {
        loader.remove();
    }
}

// ===== Global Exports =====
window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;
window.toggleSidebar = toggleSidebar;
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.saveOrderUpdate = saveOrderUpdate;
window.openProductModal = openProductModal;
window.editProduct = editProduct;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.showAdminToast = showAdminToast;
window.showAdminLoading = showAdminLoading;
window.syncInventoryFromProducts = syncInventoryFromProducts;

// Smart inventory sync: adds entries for NEW products/sizes, preserves existing stock statuses.
async function clearAndResyncInventory() {
    const btn = document.querySelector('button[onclick="clearAndResyncInventory()"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...'; }
    try {
        showAdminToast('Syncing inventory from products...', 'info');
        // Fetch all products AND existing inventory in parallel
        const [prodSnap, invSnap] = await Promise.all([
            db.collection('products').get(),
            db.collection('inventory').get()
        ]);
        const products = prodSnap.docs.map(d => ({ docId: d.id, ...d.data() }));

        // Build a set of already-existing productName+size keys so we only create NEW entries
        const existingKeys = new Set(
            (invSnap.docs || []).map(d => {
                const inv = d.data ? d.data() : d;
                return (inv.productName || '') + '||' + (inv.size || '');
            })
        );

        const now = new Date().toISOString();
        const newRecords = [];
        for (const p of products) {
            const sizes = Array.isArray(p.sizes) ? p.sizes.filter(Boolean) : [];
            if (!sizes.length) continue;
            const cvColors = (Array.isArray(p.colorVariants) ? p.colorVariants : [])
                .map(cv => (cv && cv.name) ? cv.name : null).filter(Boolean);
            const colors = cvColors.length ? cvColors : getColorsForCategory(p.category || '');
            const colorList = colors.length ? colors : ['Standard'];
            for (const size of sizes) {
                const key = (p.name || '') + '||' + size;
                if (existingKeys.has(key)) continue; // Already exists — keep its current status
                for (const color of colorList) {
                    newRecords.push({
                        productName: p.name,
                        productCategory: p.category || '',
                        size,
                        color,
                        quantity: 50,
                        status: 'in_stock',
                        updatedAt: now
                    });
                }
            }
        }

        // Bulk-insert only the NEW rows
        if (window._supaClient && newRecords.length) {
            const CHUNK = 500;
            for (let i = 0; i < newRecords.length; i += CHUNK) {
                const { error: insErr } = await window._supaClient.from('inventory').insert(newRecords.slice(i, i + CHUNK));
                if (insErr) throw new Error('Insert failed: ' + insErr.message);
            }
        }

        _invalidateCache('inventory');
        const msg = newRecords.length
            ? `Synced! Added ${newRecords.length} new entries. Existing stock statuses preserved.`
            : 'All products already have inventory entries — nothing changed.';
        showAdminToast(msg);
        loadInventory();
    } catch (err) {
        console.error('[resync]', err);
        showAdminToast('Sync failed: ' + err.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sync"></i> Sync'; }
    }
}
window.clearAndResyncInventory = clearAndResyncInventory;
window.openStockModal = openStockModal;
window.saveStock = saveStock;
window.closeModal = closeModal;


// ===== NEW: Reset Password Feature =====
function handleResetPassword(e) {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    document.getElementById('currentPasswordError').style.display = 'none';
    document.getElementById('newPasswordError').style.display = 'none';
    document.getElementById('confirmPasswordError').style.display = 'none';
    if (newPass.length < 6) {
        document.getElementById('newPasswordError').textContent = 'Min 6 chars';
        document.getElementById('newPasswordError').style.display = 'block';
        return;
    }
    if (newPass !== confirm) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords don\u0027t match';
        document.getElementById('confirmPasswordError').style.display = 'block';
        return;
    }
    const user = window.getCurrentUser();
    if (!user) { showAdminToast('User not found', 'error'); return; }
    auth.signInWithEmailAndPassword(user.email, current)
        .then(() => auth.updatePassword(newPass))
        .then(() => {
            showAdminToast('✓ Password updated successfully', 'success');
            closeModal('resetPasswordModal');
            document.getElementById('resetPasswordForm').reset();
        })
        .catch(err => {
            const msg = err.message.includes('wrong') || err.message.includes('invalid') ? 'Current password is incorrect' : err.message;
            document.getElementById('currentPasswordError').textContent = msg;
            document.getElementById('currentPasswordError').style.display = 'block';
        });
}

// ===== NEW: Edit Order Modal =====
async function editOrderModal(docId) {
    const order = allOrders.find(o => o.docId === docId);
    if (!order) return;
    document.getElementById('editOrderId').value = docId;
    document.getElementById('editOrderIdDisplay').value = order.orderId || docId.slice(0, 8);
    document.getElementById('editOrderStatus').value = order.status || 'Processing';
    document.getElementById('editOrderAddress').value = order.address || '';
    document.getElementById('editOrderCity').value = order.city || '';
    document.getElementById('editOrderPincode').value = order.pincode || '';
    document.getElementById('editOrderTracking').value = order.trackingId || '';
    openModal('editOrderModal');
}

// ===== NEW: Save Order Modifications =====
async function saveOrderModifications(e) {
    e.preventDefault();
    const docId = document.getElementById('editOrderId').value;
    const status = document.getElementById('editOrderStatus').value;
    const address = document.getElementById('editOrderAddress').value;
    const city = document.getElementById('editOrderCity').value;
    const pincode = document.getElementById('editOrderPincode').value;
    const tracking = document.getElementById('editOrderTracking').value;
    try {
        const docRef = db.collection('orders').doc(docId);
        await docRef.update({status, address, city, pincode, trackingId: tracking, updatedAt: fsServerTimestamp()});
        showAdminToast('✓ Order updated successfully', 'success');
        closeModal('editOrderModal');
        loadOrders();
    } catch (err) {
        showAdminToast('✗ Failed to update: ' + err.message, 'error');
    }
}

// ===== Product Image Upload =====
// Converts the selected image to a compressed JPEG data-URL client-side.

// Insert trademark / registered symbol at cursor position in product name field
function insertNameSymbol(sym) {
    const inp = document.getElementById('pName');
    if (!inp) return;
    const s = inp.selectionStart, e = inp.selectionEnd;
    inp.value = inp.value.slice(0, s) + sym + inp.value.slice(e);
    inp.selectionStart = inp.selectionEnd = s + sym.length;
    inp.focus();
}
window.insertNameSymbol = insertNameSymbol;

function handleMainImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const MAX_W = 900, MAX_H = 900, QUALITY = 0.82;
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            let w = img.width, h = img.height;
            if (w > MAX_W || h > MAX_H) { const r = Math.min(MAX_W/w, MAX_H/h); w = Math.round(w*r); h = Math.round(h*r); }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
            document.getElementById('pMainImage').value = dataUrl;
            const preview = document.getElementById('mainImagePreview');
            const previewImg = document.getElementById('mainImagePreviewImg');
            if (previewImg) previewImg.src = dataUrl;
            if (preview) preview.style.display = '';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}
window.handleMainImageUpload = handleMainImageUpload;

function clearMainImage() {
    document.getElementById('pMainImage').value = '';
    const preview = document.getElementById('mainImagePreview');
    const previewImg = document.getElementById('mainImagePreviewImg');
    if (previewImg) previewImg.src = '';
    if (preview) preview.style.display = 'none';
}
window.clearMainImage = clearMainImage;

function previewMainImage() {
    // kept for backward compat — no-op now that upload replaces URL input
}
window.previewMainImage = previewMainImage;

// ===== Category Management =====
// Categories are stored in settings/categories { list:[{slug,label,signature}] }
// and cached in localStorage 'ssa_categories_v1' (shared with the public site).
const ADMIN_DEFAULT_CATEGORIES = [
    { slug: 'scrub-suits',    label: 'CliniFlex\u2122 Scrubs', signature: true },
    { slug: 'doctor-uniform', label: 'Doctor Uniform',  signature: false },
    { slug: 'staff-uniform',  label: 'Staff Uniform',   signature: false },
    { slug: 'bedsheets',      label: 'Bedsheets',       signature: false },
    { slug: 'hospital-linen', label: 'Hospital Linen',  signature: false },
    { slug: 'hotel-linen',    label: 'Hotel Linen',     signature: false },
];
const ADMIN_CATS_CACHE_KEY = 'ssa_categories_v1';
let _adminCategories = null; // working copy (unsaved edits live here)
const _openSubCats = new Set(); // slugs whose sub-category panel is expanded

// Normalize a category's sub-category array to { slug, label, image, gender, sleeve }.
function _normSubs(subs) {
    return Array.isArray(subs) ? subs.filter(s => s && s.slug).map(s => ({ slug: s.slug, label: s.label || s.slug, image: s.image || '', gender: s.gender || '', sleeve: s.sleeve || '' })) : [];
}

function _readCachedCategories() {
    try {
        const raw = localStorage.getItem(ADMIN_CATS_CACHE_KEY);
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list) && list.length) return list;
        }
    } catch (e) { /* ignore */ }
    return ADMIN_DEFAULT_CATEGORIES.map(c => ({ ...c }));
}

function _slugify(label) {
    return String(label || '').toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function _escHtmlCat(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ============================================================================
// ===== 3-LEVEL CATEGORY TREE (Main Heading → Main Category → Sub Category) =====
// Stored in Supabase settings/taxonomy (JSON in `name`) + localStorage cache.
// ============================================================================
const ADMIN_TAX_CACHE_KEY = 'ssa_taxonomy_v1';
let _adminTax = null;
const _openTaxNodes = new Set(); // 'h:<hi>' or 'c:<hi>/<ci>' expanded keys

const ADMIN_DEFAULT_TAX = [
    { slug: 'doctor-uniform', label: 'Doctor Uniform', icon: 'user-md', cats: [
        { slug: 'male-doctor-uniform', label: 'Male Doctor Uniform', image: '', map: { cat: 'doctor-uniform', gender: 'male' }, subs: [
            { slug: 'male-doctor-full', label: 'Full Sleeve', image: '', map: { cat: 'doctor-uniform', gender: 'male', sleeve: 'full' } },
            { slug: 'male-doctor-half', label: 'Half Sleeve', image: '', map: { cat: 'doctor-uniform', gender: 'male', sleeve: 'half' } },
        ] },
        { slug: 'female-doctor-uniform', label: 'Female Doctor Uniform', image: '', map: { cat: 'doctor-uniform', gender: 'female' }, subs: [
            { slug: 'female-doctor-full', label: 'Full Sleeve', image: '', map: { cat: 'doctor-uniform', gender: 'female', sleeve: 'full' } },
            { slug: 'female-doctor-half', label: 'Half Sleeve', image: '', map: { cat: 'doctor-uniform', gender: 'female', sleeve: 'half' } },
        ] },
    ] },
    { slug: 'staff-uniform', label: 'Staff Uniform', icon: 'tshirt', cats: [
        { slug: 'male-staff-uniform', label: 'Male Staff Uniform', image: '', map: { cat: 'staff-uniform', gender: 'male' }, subs: [] },
        { slug: 'female-staff-uniform', label: 'Female Staff Uniform', image: '', map: { cat: 'staff-uniform', gender: 'female' }, subs: [] },
    ] },
    { slug: 'linen-bedsheets', label: 'Linen & Bedsheets', icon: 'bed', cats: [
        { slug: 'bedsheets', label: 'Bedsheets & Pillow Covers', image: '', map: { cat: 'bedsheets' }, subs: [] },
        { slug: 'hospital-linen', label: 'Hospital Linen', image: '', map: { cat: 'hospital-linen' }, subs: [
            { slug: 'surgeon-aprons', label: 'Surgeon Aprons', image: '', map: { cat: 'hospital-linen', sub: 'surgeon-aprons' } },
            { slug: 'ot-accessories', label: 'OT Accessories', image: '', map: { cat: 'hospital-linen', sub: 'ot-accessories' } },
            { slug: 'patient-wear', label: 'Patient Wear', image: '', map: { cat: 'hospital-linen', sub: 'patient-wear' } },
        ] },
        { slug: 'hotel-linen', label: 'Hotel Linen', image: '', map: { cat: 'hotel-linen' }, subs: [] },
    ] },
    { slug: 'scrub-suits', label: 'CliniFlex\u2122 Scrubs', icon: 'award', signature: true, cats: [
        { slug: 'gents-scrubs', label: 'Gents Scrub Suits', image: '', map: { cat: 'scrub-suits', gender: 'male' }, subs: [] },
        { slug: 'ladies-scrubs', label: 'Ladies Scrub Suits', image: '', map: { cat: 'scrub-suits', gender: 'female' }, subs: [] },
        { slug: 'all-scrubs', label: 'All Scrub Suits', image: '', map: { cat: 'scrub-suits' }, subs: [] },
    ] },
];

function _readCachedTax() {
    try { const raw = localStorage.getItem(ADMIN_TAX_CACHE_KEY); if (raw) { const t = JSON.parse(raw); if (Array.isArray(t) && t.length) return t; } } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(ADMIN_DEFAULT_TAX));
}
function _parseTaxDoc(d) {
    if (!d) return null;
    if (Array.isArray(d.list) && d.list.length) return d.list;
    if (typeof d.name === 'string' && d.name.trim().startsWith('[')) { try { const a = JSON.parse(d.name); if (Array.isArray(a) && a.length) return a; } catch (e) { /* ignore */ } }
    return null;
}

async function loadTaxonomy(silent) {
    _adminTax = _readCachedTax();
    renderTaxonomyEditor();
    if (window.db) {
        let hasDoc = false;
        try {
            const doc = await window.db.collection('settings').doc('taxonomy').get();
            if (doc && doc.exists) {
                const t = _parseTaxDoc(doc.data());
                if (t && t.length) { _adminTax = t; localStorage.setItem(ADMIN_TAX_CACHE_KEY, JSON.stringify(t)); renderTaxonomyEditor(); hasDoc = true; }
            }
        } catch (e) { /* keep cache */ }
        if (!hasDoc) { try { await _migrateToTaxonomy(silent); } catch (e) { /* ignore */ } }
    }
    if (typeof refreshProductTaxonomy === 'function') refreshProductTaxonomy();
}
window.loadTaxonomy = loadTaxonomy;

let _taxMigrationNotified = false;
// Build the 3-level tree from the previously-authored mega-menu (column→heading,
// item→main category, child→sub category), preserving cat/gender/sleeve/sub maps.
async function _migrateToTaxonomy(silent) {
    let mega = null;
    try { const d = await window.db.collection('settings').doc('megamenu').get(); if (d && d.exists) mega = _parseMegaDoc(d.data()); } catch (e) { /* ignore */ }
    if (!Array.isArray(mega) || !mega.length) { _adminTax = _readCachedTax(); renderTaxonomyEditor(); return; }
    const cleanMap = (node, parentCat) => { const m = {}; const cat = node.cat || parentCat || ''; if (cat) m.cat = cat; if (node.gender) m.gender = node.gender; if (node.sleeve) m.sleeve = node.sleeve; if (node.sub) m.sub = node.sub; return m; };
    const tax = mega.map(col => {
        const hslug = _slugify(col.title) || col.cat || 'heading';
        return { slug: hslug, label: col.title || hslug, icon: col.icon || 'th-large', cats: (col.items || []).map(it => ({
            slug: _slugify(it.label) || 'category', label: it.label, image: '', map: cleanMap(it, col.cat),
            subs: (it.children || []).map(ch => ({ slug: _slugify(ch.label) || 'sub', label: ch.label, image: '', map: cleanMap(ch, it.cat || col.cat) }))
        })) };
    });
    if (!tax.some(h => h.signature || h.slug === 'scrub-suits')) {
        const cf = ADMIN_DEFAULT_TAX.find(h => h.signature); if (cf) tax.push(JSON.parse(JSON.stringify(cf)));
    }
    _adminTax = tax;
    localStorage.setItem(ADMIN_TAX_CACHE_KEY, JSON.stringify(tax));
    renderTaxonomyEditor();
    if (typeof refreshProductTaxonomy === 'function') refreshProductTaxonomy();
    if (!silent && !_taxMigrationNotified) { _taxMigrationNotified = true; showAdminToast('Built a 3-level Category Tree from your menu \u2014 review, then Save & Publish.', 'info'); }
}

// ----- Tree renderer -----
function renderTaxonomyEditor() {
    const wrap = document.getElementById('taxonomyEditor');
    if (!wrap) return;
    const tax = _adminTax || _readCachedTax();
    if (!tax.length) { wrap.innerHTML = '<p class="empty">No headings yet. Add one above.</p>'; return; }
    wrap.innerHTML = tax.map((h, hi) => {
        const hOpen = _openTaxNodes.has('h:' + hi);
        const cats = h.cats || [];
        return `
        <div class="tax-heading${h.signature ? ' is-signature' : ''}" draggable="true" data-heading-idx="${hi}">
            <div class="tax-heading-main">
                <span class="tax-drag-handle" title="Drag to reorder"><i class="fas fa-grip-vertical"></i></span>
                <button type="button" class="tax-toggle" onclick="toggleTaxNode('h:${hi}')" title="Expand/collapse"><i class="fas fa-chevron-${hOpen ? 'down' : 'right'}"></i></button>
                <span class="tax-level-badge heading">Heading</span>
                ${h.signature ? '<i class="fas fa-star tax-sig-star" title="Signature heading"></i>' : ''}
                <input type="text" class="tax-name tax-name-h" id="tax-h-input-${hi}" value="${_escHtmlCat(h.label)}" oninput="setHeadingLabel(${hi},this.value)" placeholder="Main Heading name">
                <button type="button" class="tax-sym-insert" title="Insert ™ at cursor position in name" onclick="insertHeadingSymbol(${hi},'\u2122')">™</button>
                <button type="button" class="tax-sym-insert" title="Insert ® at cursor position in name" onclick="insertHeadingSymbol(${hi},'\u00ae')">®</button>
                <span class="tax-count">${cats.length} categor${cats.length === 1 ? 'y' : 'ies'}</span>
                <label class="tax-sig-toggle" title="Show as a separate highlighted collection (like CliniFlex)"><input type="checkbox" ${h.signature ? 'checked' : ''} onchange="toggleHeadingSignature(${hi},this.checked)"> Signature</label>
                <button type="button" class="cat-del-btn" title="Remove heading" onclick="deleteHeading(${hi})"><i class="fas fa-trash"></i></button>
            </div>
            ${hOpen ? `<div class="tax-cats">
                ${cats.map((c, ci) => {
                    const cKey = 'c:' + hi + '/' + ci; const cOpen = _openTaxNodes.has(cKey); const subs = c.subs || [];
                    return `<div class="tax-cat" draggable="true" data-heading-idx="${hi}" data-category-idx="${ci}">
                        <div class="tax-cat-main">
                            <span class="tax-drag-handle" title="Drag to reorder"><i class="fas fa-grip-vertical"></i></span>
                            <button type="button" class="tax-toggle" onclick="toggleTaxNode('${cKey}')"><i class="fas fa-chevron-${cOpen ? 'down' : 'right'}"></i></button>
                            <span class="tax-level-badge cat">Category</span>
                            <input type="text" class="tax-name" value="${_escHtmlCat(c.label)}" oninput="setMainCatLabel(${hi},${ci},this.value)" placeholder="Main Category name">
                            <code class="tax-slug">${_escHtmlCat(c.slug)}</code>
                            <span class="tax-count">${subs.length} sub</span>
                            <button type="button" class="cat-del-btn" title="Remove category" onclick="deleteMainCat(${hi},${ci})"><i class="fas fa-trash"></i></button>
                        </div>
                        ${cOpen ? `<div class="tax-subs">
                            ${subs.length ? subs.map((s, si) => `<div class="tax-sub">
                                <span class="tax-tick">\u21b3</span>
                                <span class="tax-level-badge sub">Sub</span>
                                <input type="text" class="tax-name" value="${_escHtmlCat(s.label)}" oninput="setSub2Label(${hi},${ci},${si},this.value)" placeholder="Sub Category name">
                                <code class="tax-slug">${_escHtmlCat(s.slug)}</code>
                                <button type="button" class="cat-del-btn" title="Remove sub-category" onclick="deleteSub2(${hi},${ci},${si})"><i class="fas fa-trash"></i></button>
                            </div>`).join('') : '<p class="tax-empty">No sub-categories yet.</p>'}
                            <div class="tax-add"><input type="text" id="newSub_${hi}_${ci}" placeholder="Add sub-category (e.g. Full Sleeve)" onkeydown="if(event.key==='Enter'){event.preventDefault();addSub2(${hi},${ci});}"><button type="button" class="btn-secondary btn-sm" onclick="addSub2(${hi},${ci})"><i class="fas fa-plus"></i> Add Sub</button></div>
                        </div>` : ''}
                    </div>`;
                }).join('') || '<p class="tax-empty">No main categories yet.</p>'}
                <div class="tax-add"><input type="text" id="newCat_${hi}" placeholder="Add main category (e.g. Male Doctor Uniform)" onkeydown="if(event.key==='Enter'){event.preventDefault();addMainCat(${hi});}"><button type="button" class="btn-secondary btn-sm" onclick="addMainCat(${hi})"><i class="fas fa-plus"></i> Add Main Category</button></div>
            </div>` : ''}
        </div>`;
    }).join('');
    _bindTaxDragHandlers();
}
window.renderTaxonomyEditor = renderTaxonomyEditor;

// ===== Drag-Drop Reordering =====
let _taxDragSource = null;
function _bindTaxDragHandlers() {
    const wrap = document.getElementById('taxonomyEditor');
    if (!wrap) return;
    // Bind drag handlers to heading and category elements
    wrap.querySelectorAll('[draggable="true"]').forEach(el => {
        el.addEventListener('dragstart', (e) => {
            _taxDragSource = el;
            el.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        el.addEventListener('dragend', (e) => {
            wrap.querySelectorAll('[draggable="true"]').forEach(x => x.classList.remove('dragging', 'drag-over'));
            _taxDragSource = null;
        });
        el.addEventListener('dragover', (e) => {
            if (!_taxDragSource || _taxDragSource === el) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            el.classList.add('drag-over');
        });
        el.addEventListener('dragleave', (e) => {
            if (e.target === el) el.classList.remove('drag-over');
        });
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!_taxDragSource || _taxDragSource === el) return;
            const srcHi = _taxDragSource.dataset.headingIdx;
            const srcCi = _taxDragSource.dataset.categoryIdx;
            const tgtHi = el.dataset.headingIdx;
            const tgtCi = el.dataset.categoryIdx;
            if (!_adminTax) _adminTax = _readCachedTax();
            // Reorder within same heading (categories)
            if (srcCi !== undefined && tgtCi !== undefined && srcHi === tgtHi) {
                const h = _adminTax[srcHi];
                if (h && h.cats) {
                    const cats = h.cats;
                    if (srcCi !== tgtCi) {
                        const temp = cats[srcCi];
                        cats.splice(srcCi, 1);
                        cats.splice(tgtCi, 0, temp);
                    }
                }
            }
            // Reorder headings
            else if (srcCi === undefined && tgtCi === undefined) {
                if (srcHi !== tgtHi) {
                    const temp = _adminTax[srcHi];
                    _adminTax.splice(srcHi, 1);
                    _adminTax.splice(tgtHi, 0, temp);
                }
            }
            renderTaxonomyEditor();
            showAdminToast('Category reordered. Don\u2019t forget to Save & Publish!', 'info');
        });
    });
}
window._bindTaxDragHandlers = _bindTaxDragHandlers;

function toggleTaxNode(key) { if (_openTaxNodes.has(key)) _openTaxNodes.delete(key); else _openTaxNodes.add(key); renderTaxonomyEditor(); }
window.toggleTaxNode = toggleTaxNode;

function addHeading() {
    const el = document.getElementById('newHeadingLabel'); const sig = document.getElementById('newHeadingSignature');
    const label = (el?.value || '').trim(); if (!label) { showAdminToast('Enter a heading name', 'error'); return; }
    const slug = _slugify(label); if (!slug) { showAdminToast('Heading name must contain letters or numbers', 'error'); return; }
    if (!_adminTax) _adminTax = _readCachedTax();
    if (_adminTax.some(h => h.slug === slug)) { showAdminToast('That heading already exists', 'error'); return; }
    _adminTax.push({ slug, label, icon: 'th-large', signature: !!(sig && sig.checked), cats: [] });
    _openTaxNodes.add('h:' + (_adminTax.length - 1));
    if (el) el.value = ''; if (sig) sig.checked = false;
    renderTaxonomyEditor();
    showAdminToast('Added heading "' + label + '". Add categories under it, then Save & Publish.', 'info');
}
window.addHeading = addHeading;
function setHeadingLabel(hi, v) { if (!_adminTax) _adminTax = _readCachedTax(); if (_adminTax[hi]) _adminTax[hi].label = v; }
window.setHeadingLabel = setHeadingLabel;
function toggleHeadingSignature(hi, ch) { if (!_adminTax) _adminTax = _readCachedTax(); if (_adminTax[hi]) _adminTax[hi].signature = !!ch; renderTaxonomyEditor(); }
window.toggleHeadingSignature = toggleHeadingSignature;
// Insert ™ or ® at the cursor position inside the heading name input.
// The symbol becomes part of the label text — admin controls exact placement.
function insertHeadingSymbol(hi, sym) {
    const input = document.getElementById('tax-h-input-' + hi);
    if (input) {
        const start = input.selectionStart != null ? input.selectionStart : input.value.length;
        const end   = input.selectionEnd   != null ? input.selectionEnd   : input.value.length;
        input.value = input.value.slice(0, start) + sym + input.value.slice(end);
        input.setSelectionRange(start + sym.length, start + sym.length);
        input.focus();
    }
    if (!_adminTax) _adminTax = _readCachedTax();
    if (_adminTax[hi]) _adminTax[hi].label = input ? input.value : (_adminTax[hi].label + sym);
    // Clear the legacy symbol field — the character is now in the label itself
    if (_adminTax[hi]) _adminTax[hi].symbol = '';
}
window.insertHeadingSymbol = insertHeadingSymbol;
// Legacy stub kept so old saved taxonomy with symbol:'tm'/'r' doesn't break
function setHeadingSymbol(hi, v) { if (!_adminTax) _adminTax = _readCachedTax(); if (_adminTax[hi]) _adminTax[hi].symbol = v || ''; renderTaxonomyEditor(); }
window.setHeadingSymbol = setHeadingSymbol;
function deleteHeading(hi) { if (!_adminTax) _adminTax = _readCachedTax(); const h = _adminTax[hi]; if (!h) return; if (!confirm(`Remove the "${h.label}" heading and everything under it?`)) return; _adminTax.splice(hi, 1); renderTaxonomyEditor(); if (typeof refreshProductTaxonomy === 'function') refreshProductTaxonomy(); }
window.deleteHeading = deleteHeading;

function addMainCat(hi) {
    if (!_adminTax) _adminTax = _readCachedTax(); const h = _adminTax[hi]; if (!h) return;
    const el = document.getElementById('newCat_' + hi); const label = (el?.value || '').trim();
    if (!label) { showAdminToast('Enter a main category name', 'error'); return; }
    const slug = _slugify(label); if (!slug) { showAdminToast('Name must contain letters or numbers', 'error'); return; }
    h.cats = h.cats || []; if (h.cats.some(c => c.slug === slug)) { showAdminToast('That category already exists here', 'error'); return; }
    h.cats.push({ slug, label, image: '', map: {}, subs: [] });
    _openTaxNodes.add('h:' + hi);
    if (el) el.value = '';
    renderTaxonomyEditor(); if (typeof refreshProductTaxonomy === 'function') refreshProductTaxonomy();
    showAdminToast('Added category "' + label + '".', 'info');
}
window.addMainCat = addMainCat;
function setMainCatLabel(hi, ci, v) { if (!_adminTax) _adminTax = _readCachedTax(); const c = _adminTax[hi] && _adminTax[hi].cats[ci]; if (c) c.label = v; }
window.setMainCatLabel = setMainCatLabel;
function deleteMainCat(hi, ci) { if (!_adminTax) _adminTax = _readCachedTax(); const c = _adminTax[hi] && _adminTax[hi].cats[ci]; if (!c) return; if (!confirm(`Remove the "${c.label}" category?`)) return; _adminTax[hi].cats.splice(ci, 1); renderTaxonomyEditor(); if (typeof refreshProductTaxonomy === 'function') refreshProductTaxonomy(); }
window.deleteMainCat = deleteMainCat;

function addSub2(hi, ci) {
    if (!_adminTax) _adminTax = _readCachedTax(); const c = _adminTax[hi] && _adminTax[hi].cats[ci]; if (!c) return;
    const el = document.getElementById('newSub_' + hi + '_' + ci); const label = (el?.value || '').trim();
    if (!label) { showAdminToast('Enter a sub-category name', 'error'); return; }
    const slug = _slugify(label); if (!slug) { showAdminToast('Name must contain letters or numbers', 'error'); return; }
    c.subs = c.subs || []; if (c.subs.some(s => s.slug === slug)) { showAdminToast('That sub-category already exists here', 'error'); return; }
    c.subs.push({ slug, label, image: '', map: {} });
    _openTaxNodes.add('c:' + hi + '/' + ci);
    if (el) el.value = '';
    renderTaxonomyEditor(); if (typeof refreshProductTaxonomy === 'function') refreshProductTaxonomy();
    showAdminToast('Added sub-category "' + label + '".', 'info');
}
window.addSub2 = addSub2;
function setSub2Label(hi, ci, si, v) { if (!_adminTax) _adminTax = _readCachedTax(); const s = _adminTax[hi] && _adminTax[hi].cats[ci] && _adminTax[hi].cats[ci].subs[si]; if (s) s.label = v; }
window.setSub2Label = setSub2Label;
function deleteSub2(hi, ci, si) { if (!_adminTax) _adminTax = _readCachedTax(); const c = _adminTax[hi] && _adminTax[hi].cats[ci]; if (!c || !c.subs[si]) return; if (!confirm(`Remove the "${c.subs[si].label}" sub-category?`)) return; c.subs.splice(si, 1); renderTaxonomyEditor(); if (typeof refreshProductTaxonomy === 'function') refreshProductTaxonomy(); }
window.deleteSub2 = deleteSub2;

function handleTaxImage(kind, hi, ci, si, input) {
    const file = input && input.files && input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            const MAX = 400; let w = img.width, h = img.height;
            if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; } else if (h >= w && h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
            const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            if (!_adminTax) _adminTax = _readCachedTax();
            if (kind === 'c') { const c = _adminTax[hi] && _adminTax[hi].cats[ci]; if (c) c.image = dataUrl; }
            else { const s = _adminTax[hi] && _adminTax[hi].cats[ci] && _adminTax[hi].cats[ci].subs[si]; if (s) s.image = dataUrl; }
            renderTaxonomyEditor();
            showAdminToast('Image set. Click Save & Publish to go live.', 'info');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file); input.value = '';
}
window.handleTaxImage = handleTaxImage;

async function saveTaxonomy(silent) {
    if (!_adminTax) _adminTax = _readCachedTax();
    const clean = _adminTax.filter(h => h && (h.label || '').trim()).map(h => ({
        slug: h.slug || _slugify(h.label), label: h.label.trim(), icon: h.icon || 'th-large',
        signature: !!h.signature, symbol: h.symbol || '',
        cats: (h.cats || []).filter(c => (c.label || '').trim()).map(c => ({
            slug: c.slug || _slugify(c.label), label: c.label.trim(), image: c.image || '', map: c.map || {},
            subs: (c.subs || []).filter(s => (s.label || '').trim()).map(s => ({ slug: s.slug || _slugify(s.label), label: s.label.trim(), image: s.image || '', map: s.map || {} }))
        }))
    }));
    if (!clean.length) { showAdminToast('⚠️ Add at least one heading before saving', 'error', 4000); return false; }
    localStorage.setItem(ADMIN_TAX_CACHE_KEY, JSON.stringify(clean));
    if (typeof _markProductsDirty === 'function') _markProductsDirty();
    if (window.db) {
        showAdminLoading(true);
        try { 
            await window.db.collection('settings').doc('taxonomy').set({ name: JSON.stringify(clean) }); 
            showAdminLoading(false);
            if (!silent) showAdminToast('✅ Premium collections updated! Frontend will sync in ~2 min', 'success', 5000); 
            return true; 
        }
        catch (e) { 
            showAdminLoading(false);
            if (!silent) showAdminToast('⚠️ Saved locally. Cloud sync failed: ' + (e.message || 'unknown'), 'error', 5000); 
            return false; 
        }
    }
    if (!silent) showAdminToast('💾 Saved to local storage', 'info', 3000); 
    return true;
}
window.saveTaxonomy = saveTaxonomy;
async function publishTaxonomy(btn) {
    let restore = null; if (btn) { restore = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing\u2026'; }
    const ok = await saveTaxonomy(false);
    if (btn) { btn.disabled = false; btn.innerHTML = restore; }
}
window.publishTaxonomy = publishTaxonomy;

// ----- Product form mapping helpers -----
function _adminResolveCat(c) { const m = c.map || {}; return { cat: m.cat || c.slug, gender: m.gender || '', sleeve: m.sleeve || '', sub: '' }; }
function _adminResolveSub(c, s) { const cm = c.map || {}, sm = s.map || {}; return { cat: sm.cat || cm.cat || c.slug, gender: sm.gender || cm.gender || '', sleeve: sm.sleeve || cm.sleeve || '', sub: sm.sub || ((sm.gender || sm.sleeve) ? '' : s.slug) }; }

function refreshProductTaxonomy(selectedCatSlug, selectedSubSlug) {
    populateProductMainCat(selectedCatSlug); populateProductSub(selectedCatSlug, selectedSubSlug);
}
window.refreshProductTaxonomy = refreshProductTaxonomy;
function populateProductMainCat(selectedCatSlug) {
    const sel = document.getElementById('pCategory'); if (!sel) return;
    const tax = _adminTax || _readCachedTax(); let html = '';
    tax.forEach(h => { const opts = (h.cats || []).map(c => `<option value="${_escHtmlCat(c.slug)}"${selectedCatSlug === c.slug ? ' selected' : ''}>${_escHtmlCat(c.label)}</option>`).join(''); if (opts) html += `<optgroup label="${_escHtmlCat(h.label)}">${opts}</optgroup>`; });
    sel.innerHTML = html || '<option value="">(add categories in the Category Tree)</option>';
    if (selectedCatSlug) sel.value = selectedCatSlug;
}
function populateProductSub(catSlug, selectedSubSlug) {
    const group = document.getElementById('pSubCategoryGroup'), sel = document.getElementById('pSubCategory'); if (!sel || !group) return;
    const tax = _adminTax || _readCachedTax(); let cat = null;
    tax.forEach(h => (h.cats || []).forEach(c => { if (c.slug === catSlug) cat = c; }));
    const subs = (cat && cat.subs) || [];
    if (!subs.length) { group.style.display = 'none'; sel.innerHTML = '<option value="">\u2014 None \u2014</option>'; return; }
    group.style.display = '';
    sel.innerHTML = '<option value="">\u2014 None \u2014</option>' + subs.map(s => `<option value="${_escHtmlCat(s.slug)}"${selectedSubSlug === s.slug ? ' selected' : ''}>${_escHtmlCat(s.label)}</option>`).join('');
    if (selectedSubSlug) sel.value = selectedSubSlug;
}
function refreshProductSubSelect() { const sel = document.getElementById('pCategory'); if (sel) populateProductSub(sel.value, ''); }
window.refreshProductSubSelect = refreshProductSubSelect;

// Resolve the product fields (category/subCategory/gender/sleeve) from a tree selection.
function _resolveProductMapping(catSlug, subSlug) {
    const tax = _adminTax || _readCachedTax(); let cat = null;
    tax.forEach(h => (h.cats || []).forEach(c => { if (c.slug === catSlug) cat = c; }));
    if (!cat) return { category: catSlug || '', subCategory: '', gender: '', sleeve: '' };
    if (subSlug) { const s = (cat.subs || []).find(x => x.slug === subSlug); if (s) { const r = _adminResolveSub(cat, s); return { category: r.cat, subCategory: r.sub || '', gender: r.gender || '', sleeve: r.sleeve || '' }; } }
    const r = _adminResolveCat(cat); return { category: r.cat, subCategory: '', gender: r.gender || '', sleeve: r.sleeve || '' };
}
window._resolveProductMapping = _resolveProductMapping;

// Reverse-lookup which tree node a product belongs to (for editing).
function _findProductNode(product) {
    const tax = _adminTax || _readCachedTax();
    if (!product) { const first = tax[0] && tax[0].cats && tax[0].cats[0]; return { catSlug: first ? first.slug : '', subSlug: '' }; }
    if (product.categoryNode) {
        for (const heading of tax) {
            for (const cat of (heading.cats || [])) {
                if (cat.slug === product.categoryNode) return { catSlug: cat.slug, subSlug: product.subCategoryNode || '' };
            }
        }
    }
    const pc = product.category || '', pg = product.gender || '', ps = product.sleeve || '', psub = product.subCategory || '';
    for (const h of tax) for (const c of (h.cats || [])) for (const s of (c.subs || [])) { const r = _adminResolveSub(c, s); if (r.cat === pc && (r.gender || '') === pg && (r.sleeve || '') === ps && (r.sub || '') === psub && (r.sub || r.gender || r.sleeve)) return { catSlug: c.slug, subSlug: s.slug }; }
    // Match on category + gender, ignoring sleeve (sleeve is per-product, not per category node)
    for (const h of tax) for (const c of (h.cats || [])) { const r = _adminResolveCat(c); if (r.cat === pc && (r.gender || '') === pg && (!r.sleeve || r.sleeve === ps)) return { catSlug: c.slug, subSlug: '' }; }
    for (const h of tax) for (const c of (h.cats || [])) {
        if (String(psub || '').trim() && [c.slug, c.label].some(v => String(v || '').trim().toLowerCase() === String(psub).trim().toLowerCase())) return { catSlug: c.slug, subSlug: '' };
    }
    const canonicalMatches = [];
    for (const h of tax) for (const c of (h.cats || [])) {
        const r = _adminResolveCat(c);
        if (r.cat === pc) canonicalMatches.push({ cat: c, map: r });
    }
    if (canonicalMatches.length === 1) return { catSlug: canonicalMatches[0].cat.slug, subSlug: '' };
    if (canonicalMatches.length > 1) {
        // Include product.gender directly in hints so 'female' matches ladies-scrubs, 'male' matches gents-scrubs
        const hints = [psub, product.name, product.description, pg].map(v => String(v || '').toLowerCase()).join(' ');
        const genderHinted = canonicalMatches.filter(entry => {
            if (!entry.map.gender) return false;
            const aliases = entry.map.gender === 'female' ? ['female', 'ladies', 'women'] : entry.map.gender === 'male' ? ['male', 'gents', 'men'] : [entry.map.gender];
            return aliases.some(alias => hints.includes(alias));
        });
        if (genderHinted.length === 1) return { catSlug: genderHinted[0].cat.slug, subSlug: '' };
    }
    for (const h of tax) for (const c of (h.cats || [])) { if (c.slug === pc) return { catSlug: c.slug, subSlug: psub || '' }; }
    return { catSlug: '', subSlug: '' };
}
window._findProductNode = _findProductNode;

async function loadCategories() {
    _adminCategories = _readCachedCategories();
    renderCategoriesList();
    // Refresh from Supabase (authoritative) if available
    if (window.db) {
        try {
            const doc = await window.db.collection('settings').doc('categories').get();
            if (doc && doc.exists) {
                const list = _parseCategoryDoc(doc.data());
                if (list && list.length) {
                    _adminCategories = list;
                    localStorage.setItem(ADMIN_CATS_CACHE_KEY, JSON.stringify(_adminCategories));
                    renderCategoriesList();
                }
            }
        } catch (e) { /* keep cache/defaults */ }
    }
    // One-time: convert the old Navigation Menu into Sub-categories (if none yet).
    try { await _maybeMigrateMenuToSubs(); } catch (e) { /* ignore */ }
}
window.loadCategories = loadCategories;

// Convert the previously-authored Navigation Menu (settings/megamenu) into
// sub-categories on each category — runs once, only when no sub-categories exist.
// Populates the working copy; the admin still clicks Save & Publish to persist.
async function _maybeMigrateMenuToSubs() {
    if (!Array.isArray(_adminCategories) || !_adminCategories.length) return;
    if (_adminCategories.some(c => Array.isArray(c.subs) && c.subs.length)) return; // already migrated
    let mega = null;
    if (window.db) {
        try { const d = await window.db.collection('settings').doc('megamenu').get(); if (d && d.exists) mega = _parseMegaDoc(d.data()); } catch (e) { /* ignore */ }
    }
    if (!Array.isArray(mega) || !mega.length) { try { mega = _readMega(); } catch (e) { mega = null; } }
    if (!Array.isArray(mega) || !mega.length) return;
    const catBySlug = {};
    _adminCategories.forEach(c => { c.subs = c.subs || []; catBySlug[c.slug] = c; });
    const pushSub = (catSlug, label, gender, sleeve, sub) => {
        const cat = catBySlug[catSlug];
        if (!cat || !label) return;
        const slug = sub || _slugify(label);
        if (!slug) return;
        if (cat.subs.some(s => s.slug === slug)) return;
        // Skip a redundant sub that just repeats the category's own name with no filter.
        if (!gender && !sleeve && !sub && label.trim().toLowerCase() === (cat.label || '').trim().toLowerCase()) return;
        cat.subs.push({ slug, label: label.trim(), image: '', gender: gender || '', sleeve: sleeve || '' });
    };
    mega.forEach(col => {
        const colCat = col.cat;
        (col.items || []).forEach(it => {
            const itCat = it.cat || colCat;
            if (itCat) pushSub(itCat, it.label, it.gender, it.sleeve, it.sub);
            (it.children || []).forEach(ch => {
                const chCat = ch.cat || itCat;
                const label = (it.gender || it.sleeve) ? (it.label + ' \u2014 ' + ch.label) : ch.label;
                pushSub(chCat, label, ch.gender || it.gender, ch.sleeve, ch.sub);
            });
        });
    });
    localStorage.setItem(ADMIN_CATS_CACHE_KEY, JSON.stringify(_adminCategories));
    renderCategoriesList();
    if (typeof refreshProductSubSelect === 'function') refreshProductSubSelect();
    showAdminToast('Old navigation menu converted into Sub-categories \u2014 review, then Save & Publish.', 'info');
}
window._maybeMigrateMenuToSubs = _maybeMigrateMenuToSubs;

// The live `settings` table only has text columns (name/suffix), so the category
// list is stored as JSON in `name`. Support both a native `list` array (future
// schema) and the JSON-in-name fallback.
function _parseCategoryDoc(d) {
    if (!d) return null;
    if (Array.isArray(d.list) && d.list.length) {
        return d.list.filter(c => c && c.slug).map(c => ({ slug: c.slug, label: c.label || c.slug, signature: !!c.signature, group: c.group || '', subs: _normSubs(c.subs) }));
    }
    if (typeof d.name === 'string' && d.name.trim().startsWith('[')) {
        try {
            const arr = JSON.parse(d.name);
            if (Array.isArray(arr)) return arr.filter(c => c && c.slug).map(c => ({ slug: c.slug, label: c.label || c.slug, signature: !!c.signature, group: c.group || '', subs: _normSubs(c.subs) }));
        } catch (e) { /* ignore */ }
    }
    return null;
}
window._parseCategoryDoc = _parseCategoryDoc;

// Navigation groups a category can be placed under (must match the site's
// mega-menu column data-cat values / CliniFlex dropdown).
const ADMIN_CAT_GROUPS = [
    { value: '', label: 'Standalone (chip only)' },
    { value: 'scrub-suits', label: 'Under CliniFlex\u2122 Scrubs' },
    { value: 'doctor-uniform', label: 'Under Doctor Uniform' },
    { value: 'staff-uniform', label: 'Under Staff Uniform' },
    { value: 'hospital-linen', label: 'Under Linen & Bedsheets' },
];
function _catGroupLabel(v) {
    const g = ADMIN_CAT_GROUPS.find(x => x.value === (v || ''));
    return g ? g.label : (v || 'Standalone');
}

function renderCategoriesList() {
    const wrap = document.getElementById('categoriesList');
    if (!wrap) return;
    const list = _adminCategories || _readCachedCategories();
    if (!list.length) { wrap.innerHTML = '<p class="empty">No categories yet. Add one above.</p>'; return; }
    wrap.innerHTML = list.map((c, i) => {
        const isBuiltIn = ['scrub-suits','doctor-uniform','staff-uniform','bedsheets','hospital-linen','hotel-linen'].includes(c.slug);
        const groupSelect = isBuiltIn
            ? `<span class="cat-manage-group" title="Built-in category placement"><i class="fas fa-sitemap"></i> ${_escHtmlCat(_catGroupLabel(c.group))}</span>`
            : `<label class="cat-group-toggle" title="Where this category appears in the site menu"><i class="fas fa-sitemap"></i>
                    <select onchange="setCategoryGroup(${i}, this.value)">
                        ${ADMIN_CAT_GROUPS.map(g => `<option value="${g.value}"${(c.group||'')===g.value ? ' selected' : ''}>${_escHtmlCat(g.label)}</option>`).join('')}
                    </select>
               </label>`;
        const subs = Array.isArray(c.subs) ? c.subs : [];
        const open = _openSubCats.has(c.slug);
        const subRows = subs.length ? subs.map((s, si) => `
                    <div class="cat-sub-row">
                        <label class="cat-sub-img${s.image ? ' has-img' : ''}" title="Upload sub-category image">
                            ${s.image ? `<img src="${s.image}" alt="">` : '<i class="fas fa-image"></i>'}
                            <input type="file" accept="image/*" onchange="handleSubImage(${i},${si},this)" hidden>
                        </label>
                        <input type="text" class="cat-sub-name" value="${_escHtmlCat(s.label)}" placeholder="Sub-category name" oninput="setSubLabel(${i},${si},this.value)">
                        <select class="cat-sub-sel" title="Optional: link this sub to a gender filter" onchange="setSubGender(${i},${si},this.value)">
                            ${['', 'male', 'female', 'unisex'].map(g => `<option value="${g}"${(s.gender || '') === g ? ' selected' : ''}>${g ? g : '\u2014 gender \u2014'}</option>`).join('')}
                        </select>
                        <select class="cat-sub-sel" title="Optional: link this sub to a sleeve filter" onchange="setSubSleeve(${i},${si},this.value)">
                            ${['', 'full', 'half'].map(v => `<option value="${v}"${(s.sleeve || '') === v ? ' selected' : ''}>${v ? v + ' sleeve' : '\u2014 sleeve \u2014'}</option>`).join('')}
                        </select>
                        <code class="cat-sub-slug" title="Internal ID (fixed)">${_escHtmlCat(s.slug)}</code>
                        <button type="button" class="cat-del-btn" title="Remove sub-category" onclick="deleteSubCategory(${i},${si})"><i class="fas fa-trash"></i></button>
                    </div>`).join('') : '<p class="cat-subs-empty">No sub-categories yet — add one below (e.g. Surgeon Aprons).</p>';
        const subPanel = `
            <div class="cat-subs${open ? ' open' : ''}">
                <button type="button" class="cat-subs-toggle" onclick="toggleSubs('${c.slug}')">
                    <i class="fas fa-chevron-${open ? 'down' : 'right'}"></i> Sub-categories <span class="cat-subs-count">${subs.length}</span>
                </button>
                ${open ? `<div class="cat-subs-body">
                    ${subRows}
                    <div class="cat-sub-add">
                        <input type="text" id="newSub_${i}" placeholder="e.g. Surgeon Aprons" onkeydown="if(event.key==='Enter'){event.preventDefault();addSubCategory(${i});}">
                        <button type="button" class="btn-secondary btn-sm" onclick="addSubCategory(${i})"><i class="fas fa-plus"></i> Add Sub-category</button>
                    </div>
                </div>` : ''}
            </div>`;
        return `
        <div class="cat-manage-item${c.signature ? ' is-signature' : ''}">
            <div class="cat-manage-main">
                <span class="cat-name-wrap">
                    ${c.signature ? '<i class="fas fa-star cat-sig-star" title="Signature category"></i>' : ''}
                    <input type="text" class="cat-name-input" value="${_escHtmlCat(c.label)}" title="Shop chip label — edit to rename" oninput="setCategoryLabel(${i}, this.value)">
                </span>
                <code class="cat-manage-slug" title="Internal ID (fixed — keeps product tags intact)">${_escHtmlCat(c.slug)}</code>
                <div class="cat-manage-actions">
                    ${groupSelect}
                    <label class="cat-sig-toggle" title="Signature (highlighted) category">
                        <input type="checkbox" ${c.signature ? 'checked' : ''} onchange="toggleCategorySignature(${i}, this.checked)"> Signature
                    </label>
                    <button type="button" class="cat-del-btn" title="Remove category" onclick="deleteCategory(${i})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            ${subPanel}
        </div>`;
    }).join('');
}
window.renderCategoriesList = renderCategoriesList;

function addCategory() {
    const labelEl = document.getElementById('newCatLabel');
    const sigEl = document.getElementById('newCatSignature');
    const groupEl = document.getElementById('newCatGroup');
    const label = (labelEl?.value || '').trim();
    if (!label) { showAdminToast('Enter a category name', 'error'); return; }
    const slug = _slugify(label);
    if (!slug) { showAdminToast('Category name must contain letters or numbers', 'error'); return; }
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    if (_adminCategories.some(c => c.slug === slug)) { showAdminToast('That category already exists', 'error'); return; }
    _adminCategories.push({ slug, label, signature: !!(sigEl && sigEl.checked), group: (groupEl && groupEl.value) || '' });
    if (labelEl) labelEl.value = '';
    if (sigEl) sigEl.checked = false;
    if (groupEl) groupEl.value = '';
    renderCategoriesList();
    // Keep the product form category dropdown in sync with unsaved edits.
    populateCategorySelect(document.getElementById('pCategory')?.value || 'scrub-suits');
    // Refresh the menu editor so the new category is selectable in link dropdowns.
    if (Array.isArray(_adminMega)) renderMegaEditor();
    showAdminToast('Added "' + label + '". Click Save & Publish to go live.', 'info');
}
window.addCategory = addCategory;

function deleteCategory(index) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    const c = _adminCategories[index];
    if (!c) return;
    if (!confirm(`Remove the "${c.label}" category from the shop filters?\n\nExisting products keep their data — only the filter chip is hidden.`)) return;
    _adminCategories.splice(index, 1);
    renderCategoriesList();
    // Reflect removal in the product form dropdown immediately.
    populateCategorySelect(document.getElementById('pCategory')?.value || 'scrub-suits');
    if (Array.isArray(_adminMega)) renderMegaEditor();
    showAdminToast('Removed "' + c.label + '". Click Save & Publish to go live.', 'info');
}
window.deleteCategory = deleteCategory;

function toggleCategorySignature(index, checked) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    if (_adminCategories[index]) _adminCategories[index].signature = !!checked;
    renderCategoriesList();
}
window.toggleCategorySignature = toggleCategorySignature;

// Rename a category's display label (the shop filter chip). The slug/ID stays
// fixed so existing product tags keep working. No re-render — keeps the input focused.
function setCategoryLabel(index, value) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    if (_adminCategories[index]) _adminCategories[index].label = value;
    // Refresh dependent dropdowns so the new label shows immediately.
    populateCategorySelect(document.getElementById('pCategory')?.value || 'scrub-suits');
    if (Array.isArray(_adminMega)) {
        // Preserve focus on the label input across the menu re-render.
        renderMegaEditor();
        const el = document.querySelectorAll('#categoriesList .cat-name-input')[index];
        if (el) { const p = el.value.length; el.focus(); try { el.setSelectionRange(p, p); } catch (e) {} }
    }
}
window.setCategoryLabel = setCategoryLabel;

// ===== Sub-category management (nested under each main category) =====
function toggleSubs(slug) {
    if (_openSubCats.has(slug)) _openSubCats.delete(slug); else _openSubCats.add(slug);
    renderCategoriesList();
}
window.toggleSubs = toggleSubs;

function addSubCategory(catIndex) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    const cat = _adminCategories[catIndex];
    if (!cat) return;
    const input = document.getElementById('newSub_' + catIndex);
    const label = (input?.value || '').trim();
    if (!label) { showAdminToast('Enter a sub-category name', 'error'); return; }
    const slug = _slugify(label);
    if (!slug) { showAdminToast('Sub-category name must contain letters or numbers', 'error'); return; }
    cat.subs = Array.isArray(cat.subs) ? cat.subs : [];
    if (cat.subs.some(s => s.slug === slug)) { showAdminToast('That sub-category already exists here', 'error'); return; }
    cat.subs.push({ slug, label, image: '' });
    _openSubCats.add(cat.slug);
    if (input) input.value = '';
    renderCategoriesList();
    // Keep the product form + menu editor sub dropdowns in sync.
    if (typeof refreshProductSubSelect === 'function') refreshProductSubSelect();
    if (Array.isArray(_adminMega)) renderMegaEditor();
    showAdminToast('Added sub-category "' + label + '". Click Save & Publish to go live.', 'info');
}
window.addSubCategory = addSubCategory;

function setSubLabel(catIndex, subIndex, value) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    const cat = _adminCategories[catIndex];
    if (cat && cat.subs && cat.subs[subIndex]) cat.subs[subIndex].label = value;
    // No re-render — keep the input focused while typing.
}
window.setSubLabel = setSubLabel;

function setSubGender(catIndex, subIndex, value) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    const cat = _adminCategories[catIndex];
    if (cat && cat.subs && cat.subs[subIndex]) cat.subs[subIndex].gender = value || '';
}
window.setSubGender = setSubGender;

function setSubSleeve(catIndex, subIndex, value) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    const cat = _adminCategories[catIndex];
    if (cat && cat.subs && cat.subs[subIndex]) cat.subs[subIndex].sleeve = value || '';
}
window.setSubSleeve = setSubSleeve;

function deleteSubCategory(catIndex, subIndex) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    const cat = _adminCategories[catIndex];
    if (!cat || !cat.subs || !cat.subs[subIndex]) return;
    const s = cat.subs[subIndex];
    if (!confirm(`Remove the "${s.label}" sub-category?\n\nProducts keep their data — they just won't be filtered under this sub-category.`)) return;
    cat.subs.splice(subIndex, 1);
    renderCategoriesList();
    if (typeof refreshProductSubSelect === 'function') refreshProductSubSelect();
    if (Array.isArray(_adminMega)) renderMegaEditor();
    showAdminToast('Removed "' + s.label + '". Click Save & Publish to go live.', 'info');
}
window.deleteSubCategory = deleteSubCategory;

// Resize + store a sub-category image as a compact JPEG data URL.
function handleSubImage(catIndex, subIndex, input) {
    const file = input && input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            const MAX = 400;
            let w = img.width, h = img.height;
            if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
            else if (h >= w && h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            if (!_adminCategories) _adminCategories = _readCachedCategories();
            const cat = _adminCategories[catIndex];
            if (cat && cat.subs && cat.subs[subIndex]) {
                cat.subs[subIndex].image = dataUrl;
                _openSubCats.add(cat.slug);
                renderCategoriesList();
                showAdminToast('Image set. Click Save & Publish to go live.', 'info');
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    input.value = '';
}
window.handleSubImage = handleSubImage;

function setCategoryGroup(index, value) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    if (_adminCategories[index]) _adminCategories[index].group = value || '';
    // no full re-render needed (keeps the open <select>), value is stored
}
window.setCategoryGroup = setCategoryGroup;

async function saveCategories(silent) {
    if (!_adminCategories) _adminCategories = _readCachedCategories();
    const list = _adminCategories.map(c => ({ slug: c.slug, label: c.label, signature: !!c.signature, group: c.group || '', subs: _normSubs(c.subs) }));
    if (!list.length) { showAdminToast('Add at least one category before saving', 'error'); return false; }
    localStorage.setItem(ADMIN_CATS_CACHE_KEY, JSON.stringify(list));
    _markProductsDirty();
    if (window.db) {
        try {
            // Store as JSON in the `name` text column (settings table has no jsonb
            // `list` column on the live DB) — read path parses this back.
            await window.db.collection('settings').doc('categories').set({ name: JSON.stringify(list) });
            if (!silent) showAdminToast('Categories published to the live site (' + list.length + ' total)');
            return true;
        } catch (e) {
            if (!silent) showAdminToast('Saved locally. Cloud publish failed: ' + (e.message || 'unknown'), 'error');
            return false;
        }
    } else {
        if (!silent) showAdminToast('Saved locally (' + list.length + ' categories)');
        return true;
    }
}
window.saveCategories = saveCategories;

// Unified publish — saves both the shop categories and the header navigation
// menu in one action, with a single toast. Wired to the page's Save & Publish button.
async function publishCategoryConfig(btn) {
    let restore = null;
    if (btn) { restore = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing…'; }
    const okCats = await saveCategories(true);
    const okMenu = await saveMegaMenu(true);
    if (btn) { btn.disabled = false; btn.innerHTML = restore; }
    if (okCats === false && okMenu === false) {
        showAdminToast('Nothing to publish — add a category and menu column first.', 'error');
    } else if (okCats && okMenu) {
        showAdminToast('Published to the live site — categories & navigation menu updated.');
    } else {
        showAdminToast('Saved locally, but the cloud publish partially failed. Check your connection and try again.', 'error');
    }
}
window.publishCategoryConfig = publishCategoryConfig;

// ===== Navigation Mega-Menu editor (main / sub headings) =====
const ADMIN_MEGA_CACHE = 'ssa_megamenu_v1';
const ADMIN_DEFAULT_MEGA = [
    { title: 'Doctor Uniform', cat: 'doctor-uniform', icon: 'user-md', items: [
        { label: 'Male Doctor Uniform', bold: true, cat: 'doctor-uniform', gender: 'male', children: [
            { label: 'Full Sleeve', cat: 'doctor-uniform', gender: 'male', sleeve: 'full' },
            { label: 'Half Sleeve', cat: 'doctor-uniform', gender: 'male', sleeve: 'half' } ] },
        { label: 'Female Doctor Uniform', bold: true, cat: 'doctor-uniform', gender: 'female', children: [
            { label: 'Full Sleeve', cat: 'doctor-uniform', gender: 'female', sleeve: 'full' },
            { label: 'Half Sleeve', cat: 'doctor-uniform', gender: 'female', sleeve: 'half' } ] } ] },
    { title: 'Staff Uniform', cat: 'staff-uniform', icon: 'tshirt', items: [
        { label: 'Male Staff Uniform', bold: false, cat: 'staff-uniform', gender: 'male', children: [] },
        { label: 'Female Staff Uniform', bold: false, cat: 'staff-uniform', gender: 'female', children: [] },
        { label: 'All Staff Uniforms', bold: false, cat: 'staff-uniform', children: [] } ] },
    { title: 'Linen & Bedsheets', cat: 'hospital-linen', icon: 'bed', items: [
        { label: 'Bedsheets & Pillow Covers', bold: false, cat: 'bedsheets', children: [] },
        { label: 'Hospital Linen', bold: true, cat: 'hospital-linen', children: [
            { label: 'Surgeon Aprons', cat: 'hospital-linen' },
            { label: 'OT Accessories', cat: 'hospital-linen' },
            { label: 'Patient Wear', cat: 'hospital-linen' } ] },
        { label: 'Hotel Linen', bold: true, cat: 'hotel-linen', children: [] } ] },
];
let _adminMega = null;

function _readMega() {
    try { const raw = localStorage.getItem(ADMIN_MEGA_CACHE); if (raw) { const m = JSON.parse(raw); if (Array.isArray(m) && m.length) return m; } } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(ADMIN_DEFAULT_MEGA));
}
function _parseMegaDoc(d) {
    if (!d) return null;
    if (Array.isArray(d.list) && d.list.length) return d.list;
    if (typeof d.name === 'string' && d.name.trim().startsWith('[')) { try { const a = JSON.parse(d.name); if (Array.isArray(a) && a.length) return a; } catch (e) { /* ignore */ } }
    return null;
}
async function loadMegaMenu() {
    _adminMega = _readMega();
    renderMegaEditor();
    if (window.db) {
        try {
            const doc = await window.db.collection('settings').doc('megamenu').get();
            if (doc && doc.exists) {
                const list = _parseMegaDoc(doc.data());
                if (list && list.length) { _adminMega = list; localStorage.setItem(ADMIN_MEGA_CACHE, JSON.stringify(list)); renderMegaEditor(); }
            }
        } catch (e) { /* keep cache/default */ }
    }
}
window.loadMegaMenu = loadMegaMenu;

function _megaCatOptions(sel) {
    // Use the working (possibly unsaved) category draft so a just-added category
    // is immediately selectable in the menu editor — falls back to the cache.
    const list = (Array.isArray(_adminCategories) && _adminCategories.length)
        ? _adminCategories
        : _readCachedCategories();
    return list.map(c => `<option value="${_escHtmlCat(c.slug)}"${sel === c.slug ? ' selected' : ''}>${_escHtmlCat(c.label)}</option>`).join('');
}
function _megaGenderOptions(sel) {
    return ['', 'male', 'female', 'unisex'].map(g => `<option value="${g}"${(sel || '') === g ? ' selected' : ''}>${g ? g : '\u2014 gender \u2014'}</option>`).join('');
}
// Sub-category options for the menu editor, based on the item's linked category.
function _megaSubOptions(catSlug, sel) {
    const cats = (Array.isArray(_adminCategories) && _adminCategories.length) ? _adminCategories : _readCachedCategories();
    const cat = cats.find(c => c.slug === catSlug);
    const subs = (cat && Array.isArray(cat.subs)) ? cat.subs.filter(s => s && s.slug) : [];
    if (!subs.length) return '<option value="">\u2014 no subs \u2014</option>';
    return '<option value="">\u2014 all \u2014</option>' + subs.map(s => `<option value="${_escHtmlCat(s.slug)}"${sel === s.slug ? ' selected' : ''}>${_escHtmlCat(s.label || s.slug)}</option>`).join('');
}
function _megaSleeveOptions(sel) {
    return ['', 'full', 'half'].map(s => `<option value="${s}"${(sel || '') === s ? ' selected' : ''}>${s ? s + ' sleeve' : '\u2014 sleeve \u2014'}</option>`).join('');
}
function renderMegaEditor() {
    const wrap = document.getElementById('megaMenuEditor');
    if (!wrap) return;
    if (!_adminMega) _adminMega = _readMega();
    if (!_adminMega.length) { wrap.innerHTML = '<p class="empty">No columns yet. Click \u201cAdd Column\u201d.</p>'; return; }
    wrap.innerHTML = _adminMega.map((col, ci) => `
        <div class="mega-col-edit">
            <div class="mce-head">
                <span class="mce-col-badge">Column ${ci + 1}</span>
                <input class="mce-title" type="text" value="${_escHtmlCat(col.title || '')}" placeholder="Column heading (e.g. Doctor Uniform)" oninput="megaSet(${ci},null,null,'title',this.value)">
                <label class="mce-link-wrap"><span>Links to</span>
                    <select class="mce-link" onchange="megaSet(${ci},null,null,'cat',this.value)"><option value="">\u2014 no link \u2014</option>${_megaCatOptions(col.cat)}</select>
                </label>
                <button type="button" class="cat-del-btn" title="Remove column" onclick="deleteMegaColumn(${ci})"><i class="fas fa-trash"></i></button>
            </div>
            <div class="mce-items">
                ${(col.items && col.items.length) ? `<div class="mce-legend"><span>Bold</span><span>Heading / item label</span><span>Category</span><span>Sub</span><span>Gender</span><span>Sleeve</span><span></span></div>` : ''}
                ${(col.items || []).map((it, ii) => `
                    <div class="mce-item">
                        <div class="mce-item-row">
                            <label class="mce-bold" title="Show as a bold main heading"><input type="checkbox" ${it.bold ? 'checked' : ''} onchange="megaSetBold(${ci},${ii},this.checked)"> Bold</label>
                            <input type="text" value="${_escHtmlCat(it.label || '')}" placeholder="Heading / item label" oninput="megaSet(${ci},${ii},null,'label',this.value)">
                            <select onchange="megaSetCat(${ci},${ii},null,this.value)"><option value="">\u2014 category \u2014</option>${_megaCatOptions(it.cat)}</select>
                            <select title="Sub-category" onchange="megaSet(${ci},${ii},null,'sub',this.value)">${_megaSubOptions(it.cat, it.sub)}</select>
                            <select onchange="megaSet(${ci},${ii},null,'gender',this.value)">${_megaGenderOptions(it.gender)}</select>
                            <select onchange="megaSet(${ci},${ii},null,'sleeve',this.value)">${_megaSleeveOptions(it.sleeve)}</select>
                            <button type="button" class="cat-del-btn" title="Remove item" onclick="deleteMegaItem(${ci},${ii})"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="mce-children">
                            ${(it.children || []).map((ch, chi) => `
                                <div class="mce-child-row">
                                    <span class="mce-tick">\u21b3</span>
                                    <input type="text" value="${_escHtmlCat(ch.label || '')}" placeholder="Sub-item label" oninput="megaSet(${ci},${ii},${chi},'label',this.value)">
                                    <select onchange="megaSetCat(${ci},${ii},${chi},this.value)"><option value="">\u2014 category \u2014</option>${_megaCatOptions(ch.cat)}</select>
                                    <select title="Sub-category" onchange="megaSet(${ci},${ii},${chi},'sub',this.value)">${_megaSubOptions(ch.cat, ch.sub)}</select>
                                    <select onchange="megaSet(${ci},${ii},${chi},'gender',this.value)">${_megaGenderOptions(ch.gender)}</select>
                                    <select onchange="megaSet(${ci},${ii},${chi},'sleeve',this.value)">${_megaSleeveOptions(ch.sleeve)}</select>
                                    <button type="button" class="cat-del-btn" title="Remove sub-item" onclick="deleteMegaChild(${ci},${ii},${chi})"><i class="fas fa-trash"></i></button>
                                </div>`).join('')}
                            <button type="button" class="mce-add" onclick="addMegaChild(${ci},${ii})"><i class="fas fa-plus"></i> Add sub-item</button>
                        </div>
                    </div>`).join('')}
                <button type="button" class="mce-add mce-add-item" onclick="addMegaItem(${ci})"><i class="fas fa-plus"></i> Add heading / item</button>
            </div>
        </div>`).join('');
}
window.renderMegaEditor = renderMegaEditor;

function _megaTarget(ci, ii, chi) {
    const col = _adminMega[ci]; if (!col) return null;
    if (ii == null) return col;
    const it = (col.items = col.items || [])[ii]; if (!it) return null;
    if (chi == null) return it;
    return (it.children = it.children || [])[chi] || null;
}
function megaSet(ci, ii, chi, field, value) { const t = _megaTarget(ci, ii, chi); if (t) t[field] = value; }
window.megaSet = megaSet;
// Change an item/child category and reset its sub (sub options depend on category).
function megaSetCat(ci, ii, chi, value) { const t = _megaTarget(ci, ii, chi); if (t) { t.cat = value; t.sub = ''; } renderMegaEditor(); }
window.megaSetCat = megaSetCat;
function megaSetBold(ci, ii, checked) { const t = _megaTarget(ci, ii, null); if (t) t.bold = !!checked; }
window.megaSetBold = megaSetBold;
function addMegaColumn() { if (!_adminMega) _adminMega = _readMega(); _adminMega.push({ title: 'New Column', cat: '', icon: 'th-large', items: [] }); renderMegaEditor(); }
window.addMegaColumn = addMegaColumn;
function deleteMegaColumn(ci) { if (!confirm('Remove this whole column?')) return; _adminMega.splice(ci, 1); renderMegaEditor(); }
window.deleteMegaColumn = deleteMegaColumn;
function addMegaItem(ci) { const c = _adminMega[ci]; if (!c) return; (c.items = c.items || []).push({ label: 'New Item', bold: false, cat: '', gender: '', sleeve: '', children: [] }); renderMegaEditor(); }
window.addMegaItem = addMegaItem;
function deleteMegaItem(ci, ii) { _adminMega[ci].items.splice(ii, 1); renderMegaEditor(); }
window.deleteMegaItem = deleteMegaItem;
function addMegaChild(ci, ii) { const it = _adminMega[ci].items[ii]; (it.children = it.children || []).push({ label: 'Sub-item', cat: it.cat || '', gender: '', sleeve: '' }); renderMegaEditor(); }
window.addMegaChild = addMegaChild;
function deleteMegaChild(ci, ii, chi) { _adminMega[ci].items[ii].children.splice(chi, 1); renderMegaEditor(); }
window.deleteMegaChild = deleteMegaChild;
function resetMegaMenu() { if (!confirm('Reset the navigation menu to the default layout? Unsaved edits will be lost.')) return; _adminMega = JSON.parse(JSON.stringify(ADMIN_DEFAULT_MEGA)); renderMegaEditor(); }
window.resetMegaMenu = resetMegaMenu;

async function saveMegaMenu(silent) {
    if (!_adminMega) _adminMega = _readMega();
    const clean = _adminMega.map(col => ({
        title: (col.title || '').trim(), cat: col.cat || '', icon: col.icon || 'th-large',
        items: (col.items || []).filter(it => (it.label || '').trim()).map(it => ({
            label: it.label.trim(), bold: !!it.bold, cat: it.cat || '', sub: it.sub || '', gender: it.gender || '', sleeve: it.sleeve || '',
            children: (it.children || []).filter(ch => (ch.label || '').trim()).map(ch => ({ label: ch.label.trim(), cat: ch.cat || '', sub: ch.sub || '', gender: ch.gender || '', sleeve: ch.sleeve || '' }))
        }))
    })).filter(col => col.title);
    if (!clean.length) { showAdminToast('Add at least one menu column before saving', 'error'); return false; }
    localStorage.setItem(ADMIN_MEGA_CACHE, JSON.stringify(clean));
    if (typeof _markProductsDirty === 'function') _markProductsDirty();
    if (window.db) {
        try { await window.db.collection('settings').doc('megamenu').set({ name: JSON.stringify(clean) }); if (!silent) showAdminToast('Navigation menu published to the live site'); return true; }
        catch (e) { if (!silent) showAdminToast('Saved locally. Cloud publish failed: ' + (e.message || 'unknown'), 'error'); return false; }
    } else { if (!silent) showAdminToast('Saved locally (' + clean.length + ' columns)'); return true; }
}
window.saveMegaMenu = saveMegaMenu;

// Fill the product-modal category <select> from the managed category list.
function populateCategorySelect(selected) {
    if (typeof populateProductMainCat === 'function') {
        populateProductMainCat(selected);
        const current = document.getElementById('pCategory')?.value || selected || '';
        if (typeof populateProductSub === 'function') populateProductSub(current, document.getElementById('pSubCategory')?.value || '');
        return;
    }
}
window.populateCategorySelect = populateCategorySelect;

// Fill the product-modal Sub-Category <select> from the chosen category's subs.
// Hidden when the category has no sub-categories.
function populateSubCategorySelect(catSlug, selected) {
    if (typeof populateProductSub === 'function') {
        populateProductSub(catSlug, selected);
        return;
    }
}
window.populateSubCategorySelect = populateSubCategorySelect;

// Re-fill the product Sub-Category select for the currently chosen category.
// Called on category change (resets selection) and after sub edits.
function refreshProductSubSelect(selected) {
    const catSel = document.getElementById('pCategory');
    if (!catSel) return;
    if (typeof populateProductSub === 'function') {
        populateProductSub(catSel.value, selected || '');
        return;
    }
    populateSubCategorySelect(catSel.value, selected);
}
window.refreshProductSubSelect = refreshProductSubSelect;

// ── Webhook Settings ──────────────────────────────────────────
async function loadWebhookSettings() {
    if (!window.SSA_COMM) return;
    const cfg = await window.SSA_COMM.getConfig();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('webhookContactForm', cfg.contactFormWebhook);
    set('webhookTicketStatus', cfg.ticketStatusWebhook);
    set('webhookRating', cfg.ratingWebhook);
    set('webhookLiveAgent', cfg.liveAgentWebhook);
}
async function saveWebhookSettings() {
    if (!window.SSA_COMM) { showAdminToast('Comm module not loaded', 'error'); return; }
    const get = id => document.getElementById(id)?.value?.trim() || '';
    try {
        await window.SSA_COMM.saveConfig({
            contactFormWebhook: get('webhookContactForm'),
            ticketStatusWebhook: get('webhookTicketStatus'),
            ratingWebhook: get('webhookRating'),
            liveAgentWebhook: get('webhookLiveAgent')
        });
        showAdminToast('Webhook URLs saved for every visitor (stored in Supabase). Communication flows are now active.');
    } catch (err) {
        showAdminToast('Error saving webhook URLs: ' + err.message, 'error');
    }
}
window.loadWebhookSettings = loadWebhookSettings;
window.saveWebhookSettings = saveWebhookSettings;

// ── Live Agent ON/OFF Toggle ─────────────────────────────────
async function loadLiveAgentToggle() {
    try {
        const doc = await db.collection('settings').doc('liveAgentConfig').get();
        const enabled = doc.exists ? (JSON.parse(doc.data().name || '{}').enabled !== false) : true;
        const toggle = document.getElementById('liveAgentToggle');
        if (toggle) toggle.checked = enabled;
        _updateLiveAgentLabel(enabled);
    } catch(e) { _updateLiveAgentLabel(true); }
}
async function setLiveAgentStatus(enabled) {
    try {
        await db.collection('settings').doc('liveAgentConfig').set({ name: JSON.stringify({ enabled }) });
        _updateLiveAgentLabel(enabled);
        showAdminToast(enabled ? '✅ Live Agent support is now Online' : '⏸️ Live Agent support is now Offline');
    } catch(e) {
        showAdminToast('Error saving setting: ' + e.message, 'error');
    }
}
function _updateLiveAgentLabel(enabled) {
    const label = document.getElementById('liveAgentStatusLabel');
    const slider = document.getElementById('liveAgentSlider');
    const dot = document.getElementById('liveAgentDot');
    const toggle = document.getElementById('liveAgentToggle');
    if (label) { label.textContent = enabled ? 'Online' : 'Offline'; label.style.color = enabled ? '#0d9488' : '#94a3b8'; }
    if (slider) slider.style.background = enabled ? '#0d9488' : '#cbd5e1';
    if (dot) { dot.style.background = enabled ? '#10b981' : '#94a3b8'; dot.style.boxShadow = enabled ? '0 0 0 3px rgba(16,185,129,0.2)' : 'none'; }
    // Knob
    if (slider && !slider.querySelector('.knob')) {
        const knob = document.createElement('span');
        knob.className = 'knob';
        knob.style.cssText = 'position:absolute;height:16px;width:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform 0.25s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 4px rgba(0,0,0,0.22);';
        slider.appendChild(knob);
    }
    const knob = slider?.querySelector('.knob');
    if (knob) knob.style.transform = enabled ? 'translateX(20px)' : 'translateX(0)';
}
window.loadLiveAgentToggle = loadLiveAgentToggle;
window.setLiveAgentStatus = setLiveAgentStatus;

function applyTextFormat(fieldId, action) {
    const inp = document.getElementById(fieldId);
    if (!inp) return;
    inp.focus();

    const value = inp.value || '';
    const start = inp.selectionStart ?? value.length;
    const end = inp.selectionEnd ?? value.length;

    const wrapSelection = (left, right) => {
        const a = Math.min(start, end);
        const b = Math.max(start, end);
        const selected = value.slice(a, b) || 'text';
        inp.value = value.slice(0, a) + left + selected + right + value.slice(b);
        inp.selectionStart = a + left.length;
        inp.selectionEnd = a + left.length + selected.length;
    };

    if (action === 'bold') {
        wrapSelection('**', '**');
        return;
    }
    if (action === 'italic') {
        wrapSelection('*', '*');
        return;
    }
    if (action === 'underline') {
        wrapSelection('__', '__');
        return;
    }
    if (action === 'bullet') {
        const a = Math.min(start, end);
        const b = Math.max(start, end);
        const lineStart = value.lastIndexOf('\n', Math.max(0, a - 1)) + 1;
        const lineEndPos = value.indexOf('\n', b);
        const lineEnd = lineEndPos === -1 ? value.length : lineEndPos;
        const block = value.slice(lineStart, lineEnd);
        const updated = block.split('\n').map(line => {
            if (!line.trim()) return '• ';
            if (/^\s*[-*•]\s+/.test(line)) return line;
            return '• ' + line;
        }).join('\n');
        inp.value = value.slice(0, lineStart) + updated + value.slice(lineEnd);
        inp.selectionStart = lineStart;
        inp.selectionEnd = lineStart + updated.length;
    }
}
window.applyTextFormat = applyTextFormat;

// ===== Color Variants (product form) =====
let _cvData = []; // [{name, hex, images:[url|dataUrl,...]}]
let _cvUploadsPending = 0; // count of background CV image uploads in flight

// True for very light colours (e.g. white) that need a visible border on light UI.
function _isLightHex(hex) {
    const m = /^#?([0-9a-fA-F]{6})$/.exec((hex || '').trim());
    if (!m) return false;
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 218;
}

function renderColorVariantRows() {
    const container = document.getElementById('cvContainer');
    if (!container) return;
    if (_cvData.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;padding:12px 0">No colors added yet. Click "+ Add Color" to add color variants with images.</p>';
        return;
    }
    container.innerHTML = _cvData.map((cv, idx) => `
    <div class="cv-card" data-idx="${idx}">
        <div class="cv-card-header">
            <span class="cv-swatch-bg" id="cvSwatch_${idx}" style="background:${cv.hex||'#0d9488'};width:42px;height:42px;border-radius:8px;border:1.5px solid var(--border);flex-shrink:0;display:inline-block;box-shadow:0 1px 4px rgba(0,0,0,0.14)" title="${cv.name||'unnamed'}"></span>
            <div class="cv-fields">
                <div class="cv-field-row">
                    <label class="cv-field-label">Color Name</label>
                    <input type="text" class="cv-name-input" placeholder="e.g. Navy Blue" value="${cv.name||''}" oninput="updateCV(${idx},'name',this.value)">
                </div>
                <div class="cv-field-row">
                    <label class="cv-field-label">Hex Code</label>
                    <div class="cv-hex-wrap">
                        <span class="cv-hex-prefix">#</span>
                        <input type="text" class="cv-hex-input" id="cvHexText_${idx}" placeholder="0d9488" value="${(cv.hex||'#0d9488').replace('#','')}" oninput="updateCVHex(${idx},this)" spellcheck="false" autocomplete="off" maxlength="6">
                    </div>
                </div>
            </div>
            <button type="button" class="btn-icon danger" onclick="removeColorVariant(${idx})" title="Remove color"><i class="fas fa-trash"></i></button>
        </div>
        ${(cv.suggestedColors||[]).length ? `
        <div class="cv-suggested" id="cvSuggested_${idx}">
            <span class="cv-suggested-label"><i class="fas fa-wand-magic-sparkles"></i> Colors extracted from image — click to apply:</span>
            <div class="cv-suggested-swatches">
                ${(cv.suggestedColors).map(h => `<button type="button" class="cv-sg-swatch${(cv.hex||'').toLowerCase()===h.toLowerCase()?' active':''}" style="background:${h}${_isLightHex(h)?';border-color:#cbd5e1':''}" title="${h}" onclick="applySuggestedColor(${idx},'${h}')"></button>`).join('')}
            </div>
        </div>` : ''}
        <div class="cv-imgs-grid" id="cvImgs_${idx}">
            ${(cv.images||[]).map((img,ii) => `
            <div class="cv-img-tile${img && img.startsWith('data:') ? ' cv-img-uploading' : ''}">
                <img src="${img}" class="cv-img-preview">
                ${img && img.startsWith('data:') ? '<span class="cv-img-spinner" title="Uploading…"><i class="fas fa-spinner fa-spin"></i></span>' : ''}
                <button type="button" class="cv-img-del" onclick="removeVariantImage(${idx},${ii})"><i class="fas fa-times"></i></button>
            </div>`).join('')}
            <button type="button" class="cv-add-tile" onclick="triggerCVImageUpload(${idx})">
                <i class="fas fa-plus"></i>
                <span>Add Image</span>
            </button>
        </div>
        <input type="file" id="cvFile_${idx}" accept="image/*" style="display:none" onchange="handleCVImageUpload(event,${idx})" multiple>
    </div>`).join('');
}

function addColorVariant() {
    _cvData.push({ name: '', hex: '#0d9488', images: [] });
    renderColorVariantRows();
}
window.addColorVariant = addColorVariant;

function removeColorVariant(idx) {
    _cvData.splice(idx, 1);
    renderColorVariantRows();
}
window.removeColorVariant = removeColorVariant;

function updateCV(idx, field, value) {
    if (_cvData[idx]) {
        _cvData[idx][field] = value;
        // Live-update swatch tooltip so it reflects the new name
        if (field === 'name') {
            const sw = document.getElementById(`cvSwatch_${idx}`);
            if (sw) sw.title = value || 'unnamed';
        }
    }
}
window.updateCV = updateCV;

function updateCVHex(idx, input) {
    // Input stores 6-char hex WITHOUT #
    const raw = input.value.replace(/[^0-9a-fA-F]/g, '');
    input.value = raw; // strip non-hex in real time
    const v = '#' + raw;
    if (_cvData[idx]) _cvData[idx].hex = v;
    const swatch = document.getElementById(`cvSwatch_${idx}`);
    if (swatch && raw.length === 6) swatch.style.background = v;
    // highlight matching suggested swatch
    document.querySelectorAll(`#cvSuggested_${idx} .cv-sg-swatch`).forEach(s => {
        s.classList.toggle('active', s.title.toLowerCase() === v.toLowerCase());
    });
}
window.updateCVHex = updateCVHex;

function applyColorPick(idx, value) {
    if (_cvData[idx]) _cvData[idx].hex = value;
    const swatch = document.getElementById(`cvSwatch_${idx}`);
    if (swatch) swatch.style.background = value;
    const hexText = document.getElementById(`cvHexText_${idx}`);
    if (hexText) hexText.value = value.replace('#', '');
    // highlight matching suggested swatch
    document.querySelectorAll(`#cvSuggested_${idx} .cv-sg-swatch`).forEach(s => {
        s.classList.toggle('active', s.title.toLowerCase() === value.toLowerCase());
    });
}
window.applyColorPick = applyColorPick;

function applySuggestedColor(idx, hex) {
    applyColorPick(idx, hex);
}
window.applySuggestedColor = applySuggestedColor;

function triggerCVImageUpload(idx) {
    document.getElementById(`cvFile_${idx}`)?.click();
}
window.triggerCVImageUpload = triggerCVImageUpload;

function removeVariantImage(varIdx, imgIdx) {
    if (_cvData[varIdx]) { _cvData[varIdx].images.splice(imgIdx, 1); renderColorVariantRows(); }
}
window.removeVariantImage = removeVariantImage;

function handleCVImageUpload(event, idx) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    // Process each file: compress → show preview instantly → upload in background.
    files.forEach(file => {
        _compressImageToJpeg(file, 900, 0.82).then(({ dataUrl, blob }) => {
            if (!_cvData[idx]) return;
            // Show the compressed preview immediately (small, fast).
            _cvData[idx].images.push(dataUrl);
            renderColorVariantRows();
            // Extract dominant colors from the compressed image.
            _extractDominantColors(dataUrl, 8).then(colors => {
                if (!_cvData[idx]) return;
                const existing = _cvData[idx].suggestedColors || [];
                const merged = [...new Set([...existing, ...colors])].slice(0, 12);
                _cvData[idx].suggestedColors = merged;
                if (!_cvData[idx].hex || _cvData[idx].hex === '#0d9488') {
                    _cvData[idx].hex = merged[0] || _cvData[idx].hex;
                }
                renderColorVariantRows();
            });
            // Upload to Supabase Storage in the background and swap base64 → URL.
            if (window.storage && blob) _uploadCvBlobInBackground(blob, dataUrl);
        }).catch(err => {
            console.warn('[cv-upload] compression failed:', err);
            showAdminToast('Could not read one of the images', 'error');
        });
    });
}
window.handleCVImageUpload = handleCVImageUpload;

// Compresses a File (or data-URL) to a resized JPEG. Returns { dataUrl, blob }.
function _compressImageToJpeg(fileOrDataUrl, maxDim = 900, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let w = img.width, h = img.height;
            if (w > maxDim || h > maxDim) {
                const r = Math.min(maxDim / w, maxDim / h);
                w = Math.round(w * r); h = Math.round(h * r);
            }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            canvas.toBlob(
                blob => resolve({ dataUrl, blob: blob || null }),
                'image/jpeg', quality
            );
        };
        img.onerror = () => reject(new Error('image decode failed'));
        if (typeof fileOrDataUrl === 'string') {
            img.src = fileOrDataUrl;
        } else {
            const reader = new FileReader();
            reader.onload = e => { img.src = e.target.result; };
            reader.onerror = () => reject(new Error('file read failed'));
            reader.readAsDataURL(fileOrDataUrl);
        }
    });
}

// Uploads a compressed blob to Storage, then replaces the matching base64
// preview (identified by its data-URL) with the public URL in whichever
// color variant currently holds it. Robust against index shifts.
async function _uploadCvBlobInBackground(blob, dataUrl) {
    _cvUploadsPending++;
    try {
        const path = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
        await window.storage.uploadBytes(path, blob);
        const url = await window.storage.getDownloadURL(path);
        for (const cv of _cvData) {
            const i = cv.images.indexOf(dataUrl);
            if (i !== -1) { cv.images[i] = url; break; }
        }
        renderColorVariantRows();
    } catch (e) {
        // Keep the base64 preview as a fallback; _migrateImagesBeforeSave retries on save.
        console.warn('[cv-upload] storage upload failed, will retry on save:', e.message);
    } finally {
        _cvUploadsPending--;
    }
}

/**
 * Extract N dominant colors from an image data-URL using canvas pixel sampling
 * + simple k-means clustering (3 iterations, good enough for thumbnails).
 */
function _extractDominantColors(dataUrl, n) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            try {
                const SIZE = 80; // sample at 80×80 for speed
                const canvas = document.createElement('canvas');
                canvas.width = SIZE; canvas.height = SIZE;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, SIZE, SIZE);
                const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

                // Collect pixels: separate saturated (chromatic) colours from
                // neutral tones (white / grey / black) so a genuinely white or
                // black product still surfaces its true colour instead of being skipped.
                const pixels = [];
                const neuBuckets = {
                    white: { sum:[0,0,0], count:0, snap:'#ffffff' },
                    light: { sum:[0,0,0], count:0, snap:null },
                    grey:  { sum:[0,0,0], count:0, snap:null },
                    dark:  { sum:[0,0,0], count:0, snap:null },
                    black: { sum:[0,0,0], count:0, snap:'#1f2937' }
                };
                let totalPix = 0;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                    if (a < 128) continue;
                    totalPix++;
                    const max = Math.max(r,g,b), min = Math.min(r,g,b);
                    const sat = max === 0 ? 0 : (max - min) / max;
                    const bri = max / 255;
                    if (sat < 0.12) { // neutral / greyscale — bucket it by brightness
                        const key = bri > 0.82 ? 'white' : bri > 0.6 ? 'light' : bri > 0.35 ? 'grey' : bri > 0.14 ? 'dark' : 'black';
                        const nb = neuBuckets[key];
                        nb.sum[0]+=r; nb.sum[1]+=g; nb.sum[2]+=b; nb.count++;
                        continue;
                    }
                    pixels.push([r, g, b]);
                }

                const _toHex = (r,g,b) => '#' + [r,g,b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2,'0')).join('');

                // Determine the dominant neutral tone (if any bucket is well-populated)
                let neutralHex = null, neutralCount = 0;
                {
                    let top = null;
                    for (const k in neuBuckets) { const nb = neuBuckets[k]; if (nb.count > (top ? top.count : 0)) top = nb; }
                    if (top && top.count >= Math.max(10, totalPix * 0.12)) {
                        neutralCount = top.count;
                        neutralHex = top.snap || _toHex(top.sum[0]/top.count, top.sum[1]/top.count, top.sum[2]/top.count);
                    }
                }

                // Too few chromatic pixels (e.g. a plain white or black product) —
                // return the neutral tone so the user can still pick it.
                if (pixels.length < 10) { resolve(neutralHex ? [neutralHex] : []); return; }

                // Seed: pick n pixels spread evenly across the array
                let centers = [];
                for (let k = 0; k < n; k++) {
                    centers.push([...pixels[Math.floor(k * pixels.length / n)]]);
                }

                // k-means: 4 iterations
                for (let iter = 0; iter < 4; iter++) {
                    const sums = centers.map(() => [0,0,0,0]); // r,g,b,count
                    for (const p of pixels) {
                        let best = 0, bestD = Infinity;
                        for (let k = 0; k < centers.length; k++) {
                            const dr=p[0]-centers[k][0], dg=p[1]-centers[k][1], db=p[2]-centers[k][2];
                            const d = dr*dr + dg*dg + db*db;
                            if (d < bestD) { bestD = d; best = k; }
                        }
                        sums[best][0]+=p[0]; sums[best][1]+=p[1]; sums[best][2]+=p[2]; sums[best][3]++;
                    }
                    centers = sums.map((s,k) => s[3] > 0 ? [s[0]/s[3], s[1]/s[3], s[2]/s[3]] : centers[k]);
                }

                // Sort by cluster population (sums[k][3]), then convert to hex
                const sums2 = centers.map(() => [0,0,0,0]);
                for (const p of pixels) {
                    let best = 0, bestD = Infinity;
                    for (let k = 0; k < centers.length; k++) {
                        const dr=p[0]-centers[k][0], dg=p[1]-centers[k][1], db=p[2]-centers[k][2];
                        const d = dr*dr + dg*dg + db*db;
                        if (d < bestD) { bestD = d; best = k; }
                    }
                    sums2[best][3]++;
                }
                const sorted = centers
                    .map((c,k) => ({ c, count: sums2[k][3] }))
                    .filter(x => x.count > 0)
                    .sort((a,b) => b.count - a.count);

                const hexColors = sorted.map(x => {
                    const [r,g,b] = x.c.map(v => Math.max(0, Math.min(255, Math.round(v))));
                    return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
                });

                // Blend in the dominant neutral tone. Only make it the primary
                // suggestion when the product itself is predominantly neutral
                // (e.g. a white coat); otherwise append it as an extra option so a
                // white/grey background never hijacks a coloured product's hex.
                if (neutralHex && !hexColors.some(h => h.toLowerCase() === neutralHex.toLowerCase())) {
                    const predominantlyNeutral = pixels.length < 30 || neutralCount >= totalPix * 0.6;
                    if (predominantlyNeutral) hexColors.unshift(neutralHex);
                    else hexColors.push(neutralHex);
                }

                resolve(hexColors);
            } catch(e) {
                resolve([]);
            }
        };
        img.onerror = () => resolve([]);
        img.src = dataUrl;
    });
}

function handleProductImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const MAX_W = 900, MAX_H = 900, QUALITY = 0.82;
    const btn = document.querySelector('#productForm button[type=submit]');
    const origText = btn?.innerHTML || '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; }

    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            // Resize keeping aspect ratio
            let w = img.width, h = img.height;
            if (w > MAX_W || h > MAX_H) {
                const ratio = Math.min(MAX_W / w, MAX_H / h);
                w = Math.round(w * ratio);
                h = Math.round(h * ratio);
            }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);

            // Show preview
            const preview = document.getElementById('pImagePreview');
            if (preview) { preview.src = dataUrl; preview.classList.add('show'); }

            // Store data URL as the image value (saved to Supabase with the product)
            document.getElementById('pImage').value = dataUrl;

            if (btn) { btn.disabled = false; btn.innerHTML = origText; }
            showAdminToast('Image ready — click Save to store it.');
        };
        img.onerror = () => {
            showAdminToast('Could not read image file', 'error');
            if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        };
        img.src = e.target.result;
    };
    reader.onerror = () => {
        showAdminToast('Failed to read file', 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
    };
    reader.readAsDataURL(file);
}

// ===== Messages / Support Tickets =====
let allMessages = [];
let _ticketView = 'tickets'; // 'tickets' | 'chats'
const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
const TICKET_STATUS_COLORS = { 'Open': '#6366f1', 'In Progress': '#f59e0b', 'Resolved': '#10b981', 'Closed': '#94a3b8', 'Unassigned': '#94a3b8' };

async function loadMessages() {
    const container = document.getElementById('messagesList');
    if (!container) return;

    // Only show skeleton on very first load (empty container)
    const isFirstLoad = !container.querySelector('.msg-card, .ticket-card, .empty');
    if (isFirstLoad) container.innerHTML = '<p class="empty"><i class="fas fa-spinner fa-spin"></i> Loading...</p>';

    try {
        const snap = await db.collection('messages').get();
        const newMessages = snap.docs.map(d => ({ docId: d.id, ...d.data() }))
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        // Build a lightweight fingerprint — re-render only when something actually changed
        const fingerprint = m => m.docId + '|' + (m.status || '') + '|' + (m.chatMessages || []).length + '|' + (m.createdAt?.seconds || 0) + '|' + (m.read ? 1 : 0);
        const newFP = newMessages.map(fingerprint).join(',');
        const oldFP = allMessages.map(fingerprint).join(',');

        if (!isFirstLoad && newFP === oldFP) return; // nothing changed — leave DOM untouched

        // Save textarea drafts + which cards are expanded before wiping DOM
        const uiState = _saveMessagesUIState();

        allMessages = newMessages;
        renderMessages();
        _renderTicketHeroStats();

        // Restore expanded cards and typed reply drafts after re-render
        _restoreMessagesUIState(uiState);

    } catch (err) {
        if (isFirstLoad) container.innerHTML = '<p class="empty" style="color:red">Error loading tickets: ' + err.message + '</p>';
    }
}

function _saveMessagesUIState() {
    const state = { open: {}, replies: {} };
    document.querySelectorAll('[id^="msg-full-"]').forEach(el => {
        if (el.classList.contains('open')) {
            state.open[el.id.replace('msg-full-', '')] = true;
        }
    });
    document.querySelectorAll('[id^="admin-chat-reply-"]').forEach(el => {
        if (el.value.trim()) {
            state.replies[el.id.replace('admin-chat-reply-', '')] = el.value;
        }
    });
    return state;
}

function _restoreMessagesUIState(state) {
    Object.keys(state.open).forEach(docId => {
        const el = document.getElementById('msg-full-' + docId);
        if (el) el.classList.add('open');
    });
    Object.keys(state.replies).forEach(docId => {
        const el = document.getElementById('admin-chat-reply-' + docId);
        if (el) { el.value = state.replies[docId]; el.focus && el === document.activeElement && el.focus(); }
    });
}

function _renderTicketHeroStats() {
    const el = document.getElementById('ticketHeroStats');
    if (!el) return;
    const tickets = allMessages.filter(m => m.ticketId);
    const chats = allMessages.filter(m => !m.ticketId);
    const open = tickets.filter(m => !['Closed'].includes(m.status || 'Open')).length;
    const unreadChats = chats.filter(m => !m.read).length;
    // Remove tab badge — counts live on the banner only
    const badge = document.getElementById('chatReqBadge');
    if (badge) badge.style.display = 'none';
    el.innerHTML = `
        <div class="ticket-stat"><span class="ticket-stat-num">${open}</span><span class="ticket-stat-label">Open Tickets</span></div>
        <div class="ticket-stat"><span class="ticket-stat-num">${unreadChats}</span><span class="ticket-stat-label">Unread Chats</span></div>
    `;
}

function setTicketView(view) {
    _ticketView = view;
    document.querySelectorAll('.ticket-view-tab').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    const statusFilter = document.getElementById('ticketStatusFilter');
    if (statusFilter) statusFilter.style.display = view === 'chats' ? 'none' : '';
    renderMessages();
}
window.setTicketView = setTicketView;

function renderMessages() {
    const container = document.getElementById('messagesList');
    if (!container) return;
    const search = (document.getElementById('messageSearch')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('ticketStatusFilter')?.value || '';
    let msgs = allMessages.filter(m => _ticketView === 'chats' ? !m.ticketId : !!m.ticketId);
    if (search) msgs = msgs.filter(m => (m.name||'').toLowerCase().includes(search) || (m.email||'').toLowerCase().includes(search) || (m.message||'').toLowerCase().includes(search) || (m.ticketId||'').toLowerCase().includes(search));
    if (statusFilter && _ticketView !== 'chats') msgs = msgs.filter(m => (m.status || 'Open') === statusFilter);

    if (!msgs.length) {
        container.innerHTML = _ticketView === 'chats'
            ? '<p class="empty"><i class="fas fa-comment-dots"></i>No pending chat requests</p>'
            : '<p class="empty"><i class="fas fa-ticket-alt"></i>No tickets found</p>';
        return;
    }

    if (_ticketView === 'chats') {
        // Group: Active chats first, then Ended chats
        const active = msgs.filter(m => m.status !== 'Ended');
        const ended  = msgs.filter(m => m.status === 'Ended');
        let html = '';
        if (active.length) {
            html += `<div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;color:var(--text-muted);padding:6px 4px 4px;margin-bottom:6px;border-bottom:1px solid var(--border);"><i class="fas fa-circle" style="color:#10b981;font-size:0.6rem;"></i> Active Chats (${active.length})</div>`;
            html += active.map(m => _buildChatRequestCardHTML(m)).join('');
        }
        if (ended.length) {
            html += `<div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;color:#94a3b8;padding:6px 4px 4px;margin:12px 0 6px;border-bottom:1px solid var(--border);"><i class="fas fa-check-circle" style="color:#94a3b8;font-size:0.6rem;"></i> Ended Chats (${ended.length})</div>`;
            html += ended.map(m => _buildChatRequestCardHTML(m)).join('');
        }
        container.innerHTML = html;
    } else {
        container.innerHTML = msgs.map(m => _buildTicketCardHTML(m)).join('');
    }
}

function _buildChatRequestCardHTML(m) {
    const ts = m.createdAt ? new Date(m.createdAt.seconds ? m.createdAt.seconds * 1000 : m.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
    return `
        <div class="msg-card ${m.read ? '' : 'unread'}" id="ticket-card-${m.docId}">
            <div class="msg-header" onclick="toggleMessage('${m.docId}')" style="cursor:pointer;">
                <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
                    <span style="font-size:0.7rem;font-weight:800;color:#94a3b8;background:#94a3b818;border-radius:6px;padding:3px 8px;letter-spacing:0.5px;white-space:nowrap;"><i class="fas fa-comment-dots"></i> CHAT</span>
                    <span class="msg-sender" style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><i class="fas fa-user-circle" style="color:#6366f1;margin-right:5px"></i>${m.name || 'Unknown'}</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
                    <span class="msg-time">${ts}</span>
                    <i class="fas fa-chevron-down msg-chevron" id="chevron-${m.docId}" style="font-size:0.75rem;color:var(--text-muted);transition:transform 0.22s;"></i>
                </div>
            </div>
            <div class="msg-subject" onclick="toggleMessage('${m.docId}')" style="cursor:pointer;">${m.subject || 'Live Agent Request'}</div>
            <div class="msg-meta">
                <span class="msg-tag"><i class="fas fa-envelope"></i> ${m.email || ''}</span>
                ${m.phone ? `<span class="msg-tag"><i class="fas fa-phone"></i> ${m.phone}</span>` : ''}
                ${m.customerId ? `<span class="msg-tag"><i class="fas fa-id-badge"></i> ${m.customerId}</span>` : ''}
                ${!m.read ? '<span class="msg-tag" style="background:#ede9fe;color:#6366f1;">New</span>' : ''}
            </div>
            <div class="msg-full" id="msg-full-${m.docId}">
                <div style="padding:12px 0;border-top:1px solid var(--border);margin-top:10px;">
                    <p style="margin-bottom:10px;color:var(--text-dark);line-height:1.7;white-space:pre-wrap;">${(m.message||'').replace(/</g,'&lt;')}</p>
                    ${(m.chatMessages||[]).length ? `
                    <div style="background:var(--bg-off);border-radius:10px;padding:10px 14px;margin-bottom:12px;max-height:220px;overflow-y:auto;">
                        <div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:8px;"><i class="fas fa-comments"></i> Chat Thread</div>
                        ${(m.chatMessages||[]).map(cm => `<div style="margin-bottom:8px;padding:8px 12px;border-radius:8px;background:${cm.role==='admin'?'rgba(13,148,136,0.08)':'#fff'};border-left:3px solid ${cm.role==='admin'?'var(--primary-teal)':'#94a3b8'};">
                            <div style="font-size:0.71rem;font-weight:700;color:${cm.role==='admin'?'var(--primary-teal)':'#6366f1'};margin-bottom:3px;">${cm.role==='admin'?'<i class="fas fa-headset"></i> Support Agent':'<i class="fas fa-user"></i> '+_escHtmlCat(m.name||'Customer')}</div>
                            <div style="font-size:0.82rem;color:var(--text-dark);white-space:pre-wrap;">${_escHtmlCat(cm.text||'')}</div>
                            <div style="font-size:0.68rem;color:var(--text-faint);margin-top:3px;">${new Date(cm.ts).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                        </div>`).join('')}
                    </div>` : ''}
                    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
                        <textarea id="admin-chat-reply-${m.docId}" placeholder="${m.status === 'Ended' ? 'Chat has ended — replies disabled' : 'Type reply to ' + _escHtmlCat(m.name||'customer') + '... (Shift+Enter for new line)'}" rows="2" ${m.status === 'Ended' ? 'disabled' : ''} style="width:100%;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-family:inherit;font-size:0.82rem;resize:vertical;outline:none;box-sizing:border-box;${m.status === 'Ended' ? 'background:#f8fafc;color:#94a3b8;cursor:not-allowed;' : ''}"></textarea>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;" class="chat-reply-actions">
                            <button class="btn btn-sm" style="background:${m.status === 'Ended' ? '#e2e8f0' : '#0d9488'};color:${m.status === 'Ended' ? '#94a3b8' : '#fff'};padding:7px 18px;font-size:0.8rem;cursor:${m.status === 'Ended' ? 'not-allowed' : 'pointer'};" ${m.status === 'Ended' ? 'disabled' : ''} onclick="sendAdminChatReply('${m.docId}','${_escHtmlCat(m.email||'')}','${_escHtmlCat(m.name||'Customer')}','${m.sessionId||''}')"><i class="fas fa-paper-plane"></i> Send</button>
                            <button class="btn btn-sm" style="background:#fff;color:#0f172a;border:1.5px solid var(--border);padding:7px 18px;font-size:0.8rem;" onclick="openCreateTicketModal('${m.docId}')"><i class="fas fa-ticket-alt" style="color:#6366f1"></i> Create Ticket</button>
                            ${m.status !== 'Ended' ? `<button class="btn btn-sm" style="background:#fef2f2;color:#dc2626;border:1.5px solid #fecaca;padding:7px 18px;font-size:0.8rem;" onclick="endLiveChat('${m.docId}','${_escHtmlCat(m.name||'Customer')}')" title="End this live chat session"><i class="fas fa-phone-slash"></i> End Chat</button>` : `<span style="font-size:0.75rem;font-weight:700;color:#94a3b8;padding:7px 12px;background:#f1f5f9;border-radius:8px;"><i class="fas fa-check-circle" style="color:#10b981"></i> Chat Ended</span>`}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

function _buildTicketCardHTML(m) {
    const status = m.status || 'Open';
    const isClosed = status === 'Closed';
    const statusColor = TICKET_STATUS_COLORS[status] || '#6366f1';
    const ts = m.createdAt ? new Date(m.createdAt.seconds ? m.createdAt.seconds * 1000 : m.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
    const attachments = m.attachmentUrls && m.attachmentUrls.length ? m.attachmentUrls.map(url => `<a href="${url}" target="_blank" style="color:var(--primary-teal);font-size:0.75rem;"><i class="fas fa-paperclip"></i> Attachment</a>`).join(' ') : '';
    const comments = Array.isArray(m.comments) ? m.comments : [];
    const commentsHtml = comments.length ? `<div class="ticket-thread">${comments.map(c => `
        <div class="ticket-thread-item ${c.role === 'admin' ? 'is-admin' : 'is-system'}">
            <div class="ticket-thread-meta"><strong>${c.author || (c.role === 'admin' ? 'Support Team' : 'System')}</strong><span>${c.createdAt ? new Date(c.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : ''}</span></div>
            <div class="ticket-thread-text">${(c.text||'').replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
            ${c.attachmentUrl ? `<a href="${c.attachmentUrl}" target="_blank" class="ticket-thread-attach"><i class="fas fa-paperclip"></i> ${c.attachmentName || 'Attachment'}</a>` : ''}
        </div>`).join('')}</div>` : '';
    return `
        <div class="msg-card ${m.read ? '' : 'unread'}" id="ticket-card-${m.docId}">
            <div class="msg-header" onclick="toggleMessage('${m.docId}')" style="cursor:pointer;">
                <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
                    <span style="font-size:0.7rem;font-weight:800;color:${statusColor};background:${statusColor}18;border-radius:6px;padding:3px 8px;letter-spacing:0.5px;white-space:nowrap;">${m.ticketId}</span>
                    <span class="msg-sender" style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><i class="fas fa-user-circle" style="color:#6366f1;margin-right:5px"></i>${m.name || 'Unknown'}</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
                    <span style="font-size:0.7rem;font-weight:700;color:${statusColor};background:${statusColor}18;border:1px solid ${statusColor}40;border-radius:20px;padding:2px 9px;">${status}</span>
                    <span class="msg-time">${ts}</span>
                    <i class="fas fa-chevron-down msg-chevron" id="chevron-${m.docId}" style="font-size:0.75rem;color:var(--text-muted);transition:transform 0.22s;"></i>
                </div>
            </div>
            <div class="msg-subject" onclick="toggleMessage('${m.docId}')" style="cursor:pointer;">${m.subject || 'General Inquiry'}</div>
            <div class="msg-meta">
                <span class="msg-tag"><i class="fas fa-envelope"></i> ${m.email || ''}</span>
                ${m.phone ? `<span class="msg-tag"><i class="fas fa-phone"></i> ${m.phone}</span>` : ''}
                ${m.customerId ? `<span class="msg-tag"><i class="fas fa-id-badge"></i> ${m.customerId}</span>` : ''}
                ${m.source === 'admin-created' ? `<span class="msg-tag" style="background:#ede9fe;color:#6366f1;">Admin-created</span>` : ''}
                ${!m.read ? '<span class="msg-tag" style="background:#ede9fe;color:#6366f1;">New</span>' : ''}
            </div>
            <!-- Expandable full message -->
            <div class="msg-full" id="msg-full-${m.docId}">
                <div style="padding:12px 0;border-top:1px solid var(--border);margin-top:10px;">
                    <p style="margin-bottom:10px;color:var(--text-dark);line-height:1.7;white-space:pre-wrap;">${(m.message||'').replace(/</g,'&lt;')}</p>
                    ${attachments ? `<div style="margin-bottom:10px;display:flex;flex-wrap:wrap;gap:8px;">${attachments}</div>` : ''}
                    ${commentsHtml}
                    <!-- Admin Reply / Status Update -->
                    <div style="background:${isClosed ? '#f8fafc' : 'var(--bg-secondary)'};border-radius:10px;padding:14px;margin-top:10px;border:${isClosed ? '1.5px solid #e2e8f0' : 'none'};">
                        ${isClosed ? `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><i class="fas fa-lock" style="color:#94a3b8;font-size:0.9rem;"></i><span style="font-size:0.8rem;font-weight:700;color:#94a3b8;">Ticket Closed — editing disabled</span></div>` : `<div style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:10px;">Update Ticket</div>`}
                        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center;">
                            <label style="font-size:0.78rem;font-weight:600;color:var(--text-muted);">Status:</label>
                            <select id="ticketStatus-${m.docId}" ${isClosed ? 'disabled' : ''} style="padding:5px 10px;border-radius:8px;border:1.5px solid var(--border);font-size:0.82rem;background:${isClosed ? '#f1f5f9' : '#fff'};color:${isClosed ? '#94a3b8' : 'inherit'};cursor:${isClosed ? 'not-allowed' : 'pointer'};">
                                ${TICKET_STATUSES.map(s => `<option value="${s}" ${(m.status||'Open')===s?'selected':''}>${s}</option>`).join('')}
                            </select>
                        </div>
                        <textarea id="ticketNote-${m.docId}" placeholder="${isClosed ? 'Ticket is closed — comments disabled' : 'Add a comment for the customer (optional)...'}" rows="3" ${isClosed ? 'disabled' : ''} style="width:100%;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-family:inherit;font-size:0.82rem;resize:vertical;outline:none;${isClosed ? 'background:#f1f5f9;color:#94a3b8;cursor:not-allowed;' : ''}"></textarea>
                        <div style="margin-top:8px;">
                            <label class="btn btn-sm" style="background:${isClosed ? '#f1f5f9' : 'var(--bg-primary)'};border:1.5px solid var(--border);padding:6px 14px;font-size:0.78rem;cursor:${isClosed ? 'not-allowed' : 'pointer'};display:inline-flex;align-items:center;gap:6px;color:${isClosed ? '#94a3b8' : 'inherit'};pointer-events:${isClosed ? 'none' : 'auto'};">
                                <i class="fas fa-paperclip"></i> Attach file
                                <input type="file" id="ticketFile-${m.docId}" ${isClosed ? 'disabled' : ''} style="display:none" onchange="_previewTicketFile('${m.docId}')">
                            </label>
                            <span id="ticketFileName-${m.docId}" style="font-size:0.76rem;color:var(--text-muted);margin-left:6px;"></span>
                        </div>
                        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
                            <button class="btn btn-sm" ${isClosed ? 'disabled' : ''} style="background:${isClosed ? '#e2e8f0' : 'var(--primary-teal)'};color:${isClosed ? '#94a3b8' : '#fff'};padding:7px 18px;font-size:0.8rem;cursor:${isClosed ? 'not-allowed' : 'pointer'};" onclick="updateTicketStatus('${m.docId}')"><i class="fas fa-save"></i> Save &amp; Notify Customer</button>
                            <button class="btn btn-sm" ${isClosed ? 'disabled' : ''} style="background:${isClosed ? '#f1f5f9' : 'var(--bg-primary)'};border:1.5px solid var(--border);padding:7px 18px;font-size:0.8rem;color:${isClosed ? '#94a3b8' : 'inherit'};cursor:${isClosed ? 'not-allowed' : 'pointer'};" onclick="replyToCustomer('${m.email||''}','${m.ticketId||''}')"><i class="fas fa-envelope"></i> Email Customer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

function _previewTicketFile(docId) {
    const input = document.getElementById('ticketFile-' + docId);
    const label = document.getElementById('ticketFileName-' + docId);
    if (label) label.textContent = input?.files?.[0]?.name || '';
}
window._previewTicketFile = _previewTicketFile;

async function toggleMessage(docId) {
    const full = document.getElementById('msg-full-' + docId);
    const isOpening = full && !full.classList.contains('open');

    // Auto-collapse all other expanded cards
    if (isOpening) {
        document.querySelectorAll('[id^="msg-full-"].open').forEach(el => {
            const otherId = el.id.replace('msg-full-', '');
            if (otherId !== docId) {
                el.classList.remove('open');
                const otherChevron = document.getElementById('chevron-' + otherId);
                if (otherChevron) otherChevron.style.transform = '';
            }
        });
    }

    if (full) full.classList.toggle('open');
    const chevron = document.getElementById('chevron-' + docId);
    if (chevron) chevron.style.transform = (full && full.classList.contains('open')) ? 'rotate(180deg)' : '';

    // Mark as read
    const msg = allMessages.find(m => m.docId === docId);
    if (msg && !msg.read) {
        try {
            await db.collection('messages').doc(docId).update({ read: true });
            msg.read = true;
            const card = document.getElementById('ticket-card-' + docId);
            if (card) card.classList.remove('unread');
            _updateSidebarMsgBadge();
            _renderTicketHeroStats();
        } catch (e) { /* ignore */ }
    }
}

// ── Create Ticket (Admin) ────────────────────────────────────
function openCreateTicketModal(sourceDocId) {
    const form = document.getElementById('createTicketForm');
    if (form) form.reset();
    document.getElementById('ctSourceDocId').value = sourceDocId || '';
    if (sourceDocId) {
        const src = allMessages.find(m => m.docId === sourceDocId);
        if (src) {
            document.getElementById('ctCustomerId').value = src.customerId || '';
            document.getElementById('ctCustomerName').value = src.name || '';
            document.getElementById('ctCustomerMobile').value = src.phone || '';
            document.getElementById('ctCustomerEmail').value = src.email || '';
            document.getElementById('ctSubject').value = 'Live Agent Follow-up';
            document.getElementById('ctDescription').value = src.message || '';
        }
    }
    openModal('createTicketModal');
}
window.openCreateTicketModal = openCreateTicketModal;

function closeCreateTicketModal() {
    closeModal('createTicketModal');
}
window.closeCreateTicketModal = closeCreateTicketModal;

async function submitCreateTicket(event) {
    event.preventDefault();
    const sourceDocId = document.getElementById('ctSourceDocId').value || '';
    const customerId = document.getElementById('ctCustomerId').value.trim();
    const name = document.getElementById('ctCustomerName').value.trim();
    const phone = document.getElementById('ctCustomerMobile').value.trim();
    const email = document.getElementById('ctCustomerEmail').value.trim();
    const priority = document.getElementById('ctPriority').value;
    const subject = document.getElementById('ctSubject').value.trim() || 'Support Ticket';
    const message = document.getElementById('ctDescription').value.trim();
    if (!name || !phone || !email || !message) { showAdminToast('Please fill all required fields', 'error'); return; }

    const btn = document.querySelector('#createTicketForm button[type=submit]');
    const origText = btn?.innerHTML;
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...'; }

    try {
        const ticketId = window.SSA_COMM && window.SSA_COMM.generateTicketId ? window.SSA_COMM.generateTicketId() : ('TKT-' + Date.now().toString(36).toUpperCase());
        await db.collection('messages').add({
            ticketId, name, email, phone, customerId, subject, message, priority,
            status: 'Open', source: 'admin-created', read: true,
            createdAt: window.fsServerTimestamp ? window.fsServerTimestamp() : new Date(),
            updatedAt: window.fsServerTimestamp ? window.fsServerTimestamp() : new Date()
        });

        // Mark the originating chat request as converted so it drops off the Chat Requests tab
        if (sourceDocId) {
            try { await db.collection('messages').doc(sourceDocId).update({ status: 'Converted', convertedToTicket: ticketId, read: true }); } catch (e) { /* ignore */ }
        }

        // Notify the customer their ticket was created
        let emailSent = false;
        if (window.SSA_COMM && window.SSA_COMM.sendTicketStatusUpdate) {
            emailSent = await window.SSA_COMM.sendTicketStatusUpdate({ ticketId, customerEmail: email, customerName: name, newStatus: 'Open', adminNote: message, isNew: true }).catch(() => false);
        }
        if (!emailSent) {
            showAdminToast(`Ticket ${ticketId} created — email NOT sent (configure Ticket Status webhook in Settings)`, 'warning');
        } else {
            showAdminToast(`Ticket ${ticketId} created & email sent to ${name}`);
        }
        closeCreateTicketModal();
        await loadMessages();
    } catch (err) {
        showAdminToast('Error creating ticket: ' + err.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
    }
}
window.submitCreateTicket = submitCreateTicket;

async function updateTicketStatus(docId) {
    const statusEl = document.getElementById('ticketStatus-' + docId);
    const noteEl = document.getElementById('ticketNote-' + docId);
    const fileEl = document.getElementById('ticketFile-' + docId);
    if (!statusEl) return;
    if (statusEl.disabled) { showAdminToast('This ticket is closed — editing disabled', 'error'); return; }
    const newStatus = statusEl.value;
    const noteText = noteEl?.value?.trim() || '';
    const file = fileEl?.files?.[0] || null;

    const msg = allMessages.find(m => m.docId === docId);
    if (!msg) return;

    try {
        let attachmentUrl = '', attachmentName = '';
        if (file && window.supabase) {
            const path = 'tickets/' + (msg.ticketId || docId) + '/comments/' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const { data } = await window.supabase.storage.from('assets').upload(path, file, { upsert: true });
            if (data) {
                const { data: urlData } = window.supabase.storage.from('assets').getPublicUrl(path);
                attachmentUrl = urlData?.publicUrl || '';
                attachmentName = file.name;
            }
        }

        const comments = Array.isArray(msg.comments) ? [...msg.comments] : [];
        const statusChanged = newStatus !== (msg.status || 'Open');
        if (noteText || attachmentUrl || statusChanged) {
            comments.push({
                author: 'Support Team',
                role: 'admin',
                text: noteText || (statusChanged ? `Status changed to ${newStatus}` : ''),
                attachmentUrl: attachmentUrl || undefined,
                attachmentName: attachmentName || undefined,
                createdAt: new Date().toISOString()
            });
        }

        await db.collection('messages').doc(docId).update({
            status: newStatus, adminNote: noteText, read: true,
            updatedAt: window.fsServerTimestamp ? window.fsServerTimestamp() : new Date()
        });

        msg.status = newStatus; msg.adminNote = noteText; msg.comments = comments; msg.read = true;

        // Send notification to customer via Power Automate
        let emailOk = false;
        if (window.SSA_COMM && window.SSA_COMM.sendTicketStatusUpdate) {
            emailOk = await window.SSA_COMM.sendTicketStatusUpdate({
                ticketId: msg.ticketId || docId,
                customerEmail: msg.email,
                customerName: msg.name,
                newStatus,
                adminNote: noteText
            }).catch(() => false);
        }
        if (!emailOk) {
            showAdminToast(`Status → ${newStatus} (email NOT sent — configure Ticket Status webhook in Settings)`, 'warning');
        } else {
            showAdminToast(`Ticket updated: ${newStatus} — customer notified`);
        }

        renderMessages();
        _renderTicketHeroStats();
        loadDashboard();
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}
window.updateTicketStatus = updateTicketStatus;

function replyToCustomer(email, ticketId) {
    if (!email) return;
    const subject = encodeURIComponent(`[${ticketId || 'SSA Ticket'}] Response from Siva Suresh Agency`);
    window.open(`mailto:${email}?subject=${subject}`, '_blank');
}
window.replyToCustomer = replyToCustomer;

// ── Admin reply to a live-chat session (Chat Requests tab) ──────────────
async function sendAdminChatReply(docId, customerEmail, customerName, sessionId) {
    const replyEl = document.getElementById('admin-chat-reply-' + docId);
    if (replyEl?.disabled) { showAdminToast('Chat has ended — cannot send reply', 'error'); return; }
    const text = replyEl?.value?.trim();
    if (!text) { showAdminToast('Reply cannot be empty', 'error'); return; }
    const sendBtn = replyEl?.closest('div')?.nextElementSibling?.querySelector('button');
    if (sendBtn) { sendBtn.disabled = true; sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; }
    try {
        // Atomic append — no read-first, safe for concurrent sessions
        const sb = window._supabase;
        if (!sb) throw new Error('Supabase client not available');
        const { error: rpcErr } = await sb.rpc('append_chat_message', {
            p_id: docId, p_role: 'admin', p_text: text, p_ts: new Date().toISOString()
        });
        if (rpcErr) throw new Error(rpcErr.message);
        // Also mark as read + In Progress
        await db.collection('messages').doc(docId).update({
            read: true,
            status: 'In Progress',
            updatedAt: window.fsServerTimestamp ? window.fsServerTimestamp() : new Date().toISOString()
        });
        if (replyEl) replyEl.value = '';
        if (sendBtn) { sendBtn.disabled = false; sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send'; }
        showAdminToast(`Reply sent to ${customerName}`);
        // Realtime subscription will update the card automatically
    } catch (err) {
        showAdminToast('Error sending reply: ' + err.message, 'error');
        if (sendBtn) { sendBtn.disabled = false; sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send'; }
    }
}
window.sendAdminChatReply = sendAdminChatReply;

// ── End Live Chat Session (Admin) ────────────────────────────
async function endLiveChat(docId, customerName) {
    if (!confirm(`End the live chat session with ${customerName}? The customer's bot will be re-activated.`)) return;
    try {
        // agentEnded column requires migration_tickets.sql — fallback to status-only if missing
        await db.collection('messages').doc(docId).update({
            agentEnded: true,
            status: 'Ended',
            updatedAt: window.fsServerTimestamp ? window.fsServerTimestamp() : new Date().toISOString()
        });
        showAdminToast(`Chat with ${customerName} ended — bot re-activated for customer`);
        // Realtime will update the card automatically
    } catch (err) {
        // Graceful fallback: agentEnded column may not yet exist — update status only
        try {
            await db.collection('messages').doc(docId).update({
                status: 'Ended',
                updatedAt: window.fsServerTimestamp ? window.fsServerTimestamp() : new Date().toISOString()
            });
            showAdminToast(`Chat marked Ended. Run migration_tickets.sql in Supabase to enable full end-chat signal.`, 'warning');
            // Realtime will update the card automatically
        } catch (err2) {
            showAdminToast('Error ending chat: ' + err2.message, 'error');
        }
    }
}
window.endLiveChat = endLiveChat;

// ── Supabase Realtime for admin Messages section ────────────
// Instant push updates via WebSocket — no polling, no page refresh
let _adminMsgsChannel = null;
let _adminMsgsPollingTimer = null; // fallback only

function _startAdminMsgsRealtime() {
    _stopAdminMsgsRealtime();
    const sb = window._supabase;
    if (!sb?.channel) { _fallbackToPolling(); return; }

    _adminMsgsChannel = sb.channel('admin-msgs-rt-' + Date.now())
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, p => _onMsgInsert(p.new))
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, p => _onMsgUpdate(p.new))
        .subscribe(status => {
            if (status === 'SUBSCRIBED') {
                console.log('[Admin] Realtime messages: connected');
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                console.warn('[Admin] Realtime failed, falling back to polling');
                _stopAdminMsgsRealtime();
                _fallbackToPolling();
            }
        });
}

function _stopAdminMsgsRealtime() {
    if (_adminMsgsChannel) {
        try { window._supabase?.removeChannel(_adminMsgsChannel); } catch(e) {}
        _adminMsgsChannel = null;
    }
    if (_adminMsgsPollingTimer) { clearInterval(_adminMsgsPollingTimer); _adminMsgsPollingTimer = null; }
}

function _fallbackToPolling() {
    _adminMsgsPollingTimer = setInterval(async () => {
        try { await loadMessages(); } catch(e) {}
    }, 6000);
}

// Normalize a raw Supabase Realtime row into the shape card-builders expect
function _rtNormMsg(row) {
    const msg = { docId: row.id, ...row };
    if (msg.createdAt && typeof msg.createdAt === 'string') {
        const d = new Date(msg.createdAt);
        msg.createdAt = { seconds: Math.floor(d.getTime() / 1000) };
    }
    if (typeof msg.chatMessages === 'string') {
        try { msg.chatMessages = JSON.parse(msg.chatMessages); } catch(e) { msg.chatMessages = []; }
    }
    msg.chatMessages = msg.chatMessages || [];
    return msg;
}

// Update the sidebar Messages badge from in-memory allMessages
function _updateSidebarMsgBadge() {
    const unread = allMessages.filter(m => !m.read).length;
    const badge = document.getElementById('msgBadge');
    if (badge) { badge.textContent = unread; badge.style.display = unread > 0 ? 'inline' : 'none'; }
    _renderTicketHeroStats();
}

// Show a Teams-style pop-up notification at the bottom-right
let _notifTimer = null;
function _showChatNotification(name, text) {
    let el = document.getElementById('adminChatNotif');
    if (!el) {
        el = document.createElement('div');
        el.id = 'adminChatNotif';
        el.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:#fff;border:1.5px solid #0d9488;border-radius:14px;box-shadow:0 8px 32px rgba(13,148,136,0.18);padding:14px 18px 12px;min-width:260px;max-width:340px;animation:msgSlideIn 0.35s ease;cursor:pointer;';
        el.onclick = () => { el.remove(); clearTimeout(_notifTimer); document.querySelector('[data-page="messages"]')?.click(); };
        document.body.appendChild(el);
    }
    el.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <span style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#0d9488,#6366f1);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-comment-dots" style="color:#fff;font-size:0.85rem;"></i></span>
            <div style="flex:1;min-width:0;">
                <div style="font-size:0.8rem;font-weight:700;color:#0f172a;">${name}</div>
                <div style="font-size:0.72rem;color:#64748b;">New message</div>
            </div>
            <button onclick="event.stopPropagation();this.closest('#adminChatNotif').remove()" style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:0.9rem;"><i class="fas fa-times"></i></button>
        </div>
        <div style="font-size:0.8rem;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${(text||'').replace(/</g,'&lt;').substring(0,80)}</div>
        <div style="font-size:0.68rem;color:#0d9488;margin-top:6px;font-weight:600;">Click to open →</div>
    `;
    clearTimeout(_notifTimer);
    _notifTimer = setTimeout(() => { el?.remove(); }, 8000);
}

function _onMsgInsert(row) {
    const msg = _rtNormMsg(row);
    if (allMessages.find(m => m.docId === msg.docId)) { _onMsgUpdate(row); return; }
    allMessages.unshift(msg);
    _updateSidebarMsgBadge();

    // Only inject card if we are on the matching view tab
    const isChat = !msg.ticketId;
    if ((_ticketView === 'chats') !== isChat) {
        // Admin is on a different tab — show notification
        if (isChat) _showChatNotification(msg.name || 'Visitor', msg.message || 'New chat request');
        return;
    }

    const container = document.getElementById('messagesList');
    if (!container) return;
    const emptyEl = container.querySelector('.empty');
    if (emptyEl) emptyEl.remove();

    const html = msg.ticketId ? _buildTicketCardHTML(msg) : _buildChatRequestCardHTML(msg);
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    const card = tmp.firstElementChild;
    if (card) {
        card.style.animation = 'msgSlideIn 0.4s ease';
        container.insertBefore(card, container.firstChild);
    }
    if (isChat) _showChatNotification(msg.name || 'Visitor', msg.message || 'New chat request');
    else showAdminToast(`🎫 New ticket from ${msg.name || 'visitor'}`, 'info');
}

function _onMsgUpdate(row) {
    const msg = _rtNormMsg(row);
    const docId = msg.docId;

    const idx = allMessages.findIndex(m => m.docId === docId);
    const oldMsg = idx !== -1 ? allMessages[idx] : null;
    const oldChatLen = (oldMsg?.chatMessages || []).length;
    const newChatLen = msg.chatMessages.length;
    const lastMsg = msg.chatMessages[newChatLen - 1];

    if (idx !== -1) allMessages[idx] = msg; else allMessages.unshift(msg);
    _updateSidebarMsgBadge();

    // Notify admin if a new USER message arrived on a chat session
    if (!msg.ticketId && newChatLen > oldChatLen && lastMsg?.role === 'user') {
        const cardFull = document.getElementById('msg-full-' + docId);
        const isCollapsed = !cardFull || !cardFull.classList.contains('open');
        if (isCollapsed) {
            _showChatNotification(msg.name || 'Customer', lastMsg.text || '');
        }
    }

    const card = document.getElementById('ticket-card-' + docId);
    if (!card) return;

    // Save open/draft/chevron state before rebuilding this card
    const wasOpen = document.getElementById('msg-full-' + docId)?.classList.contains('open');
    const savedDraft = document.getElementById('admin-chat-reply-' + docId)?.value || '';

    // Rebuild only this card (not the entire list)
    const html = msg.ticketId ? _buildTicketCardHTML(msg) : _buildChatRequestCardHTML(msg);
    card.outerHTML = html;

    // Restore state in the freshly rendered card
    const newCard = document.getElementById('ticket-card-' + docId);
    if (wasOpen) {
        const newFull = document.getElementById('msg-full-' + docId);
        if (newFull) {
            newFull.classList.add('open');
            // Auto-scroll the chat thread to the latest message
            const thread = newFull.querySelector('[style*="overflow-y"]');
            if (thread) setTimeout(() => { thread.scrollTop = thread.scrollHeight; }, 60);
        }
        const chevron = document.getElementById('chevron-' + docId);
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        const newReply = document.getElementById('admin-chat-reply-' + docId);
        if (newReply && savedDraft) { newReply.value = savedDraft; }
        if (newCard) newCard.style.animation = 'msgPulse 0.5s ease';
    }
}

// ── Enter key to send chat reply ─────────────────────────────
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey && e.target && e.target.id && e.target.id.startsWith('admin-chat-reply-')) {
        e.preventDefault();
        if (e.target.disabled) return;
        const docId = e.target.id.replace('admin-chat-reply-', '');
        // Find the Send button in the sibling actions div
        const actionsDiv = e.target.parentElement?.querySelector('.chat-reply-actions');
        const sendBtn = actionsDiv ? actionsDiv.querySelector('button') : null;
        if (sendBtn) sendBtn.click();
    }
});

async function markAllRead() {
    const unread = allMessages.filter(m => !m.read);
    if (!unread.length) { showAdminToast('All tickets already read'); return; }
    try {
        await Promise.all(unread.map(m => db.collection('messages').doc(m.docId).update({ read: true })));
        unread.forEach(m => m.read = true);
        renderMessages();
        loadDashboard();
        showAdminToast('All tickets marked as read');
    } catch (err) {
        showAdminToast('Error: ' + err.message, 'error');
    }
}

// ===== Export new functions =====
window.handleProductImageUpload = handleProductImageUpload;
window.loadMessages = loadMessages;
window.renderMessages = renderMessages;
window.toggleMessage = toggleMessage;
window.markAllRead = markAllRead;
window.quickAdjust = undefined; // removed — use status dropdown
window.setInvFilter = setInvFilter;
window.reconcileInventoryFromOrders = undefined; // removed — no longer qty-based
window.deduplicateInventory = deduplicateInventory;
window.exportOrdersCSV = exportOrdersCSV;
window.printOrderInvoice = printOrderInvoice;
window.updateInventoryStatus = updateInventoryStatus;
window.openStockModal = openStockModal;
window.saveStock = saveStock;
