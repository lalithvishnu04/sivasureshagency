// ============================================================
//  SSA Backend API  —  functions/index.js
//
//  Pure Supabase/Node.js — zero Firebase dependency.
//  OTP forgot-password flow → supabase/functions/ssa/index.ts
//
//  Deploy: Railway / Render / any Node.js host
//    npm install && node index.js
//
//  Env vars required:
//    SUPABASE_URL              = https://kyzlxhncnqahlpfhtoky.supabase.co
//    SUPABASE_SERVICE_ROLE_KEY = <service_role secret>
//    PORT                      = 3001  (optional)
// ============================================================

const express     = require('express');
const cors        = require('cors');
const compression = require('compression');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const NodeCache   = require('node-cache');
const Razorpay    = require('razorpay');
const crypto      = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL  || '';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL   || 'admin@sivasureshagency.com';
const RZP_KEY_ID     = process.env.RAZORPAY_KEY_ID     || '';
const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('[SSA] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars are required.');
    process.exit(1);
}

// Service-role client — bypasses RLS for all backend operations
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});
const now = () => new Date().toISOString();

// Razorpay instance — only active when both env vars are set
const rzp = (RZP_KEY_ID && RZP_KEY_SECRET)
    ? new Razorpay({ key_id: RZP_KEY_ID, key_secret: RZP_KEY_SECRET })
    : null;

// ── In-memory cache ───────────────────────────────────────────────────────────
const cache = new NodeCache({ stdTTL: 120, checkperiod: 60 });
async function cached(key, ttl, fetcher) {
    const hit = cache.get(key);
    if (hit !== undefined) return hit;
    const data = await fetcher();
    cache.set(key, data, ttl);
    return data;
}
function bust(...keys) { keys.forEach(k => cache.del(k)); }

// ── Express setup ─────────────────────────────────────────────────────────────
const app = express();

const ALLOWED_ORIGINS = [
    'https://lalithvishnu-hub.github.io',
    'https://lalithvishnu04.github.io',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
];

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        cb(new Error('CORS: ' + origin));
    },
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));

const publicLimiter = rateLimit({ windowMs: 60_000, max: 60,  standardHeaders: true, legacyHeaders: false });
const adminLimiter  = rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false });
const writeLimiter  = rateLimit({ windowMs: 60_000, max: 20,  standardHeaders: true, legacyHeaders: false });

// ── Health ─────────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, ts: Date.now(), cacheKeys: cache.keys().length }));

// =============================================================
//  PUBLIC ROUTES
// =============================================================

// GET /api/products[?category=doctor-uniform&limit=100]
app.get('/api/products', publicLimiter, async (req, res) => {
    try {
        const category = req.query.category || null;
        const lim      = Math.min(parseInt(req.query.limit) || 100, 500);
        const key      = 'products_' + (category || 'all');
        const data = await cached(key, 300, async () => {
            let q = supabase.from('products').select('*').limit(lim);
            if (category) q = q.eq('category', category);
            const { data: rows, error } = await q;
            if (error) throw new Error(error.message);
            return rows || [];
        });
        res.json({ ok: true, data, count: data.length });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// GET /api/inventory/status
app.get('/api/inventory/status', publicLimiter, async (req, res) => {
    try {
        const data = await cached('inv_status', 180, async () => {
            const { data: rows, error } = await supabase
                .from('inventory').select('productName,size,color,status,quantity');
            if (error) throw new Error(error.message);
            return (rows || []).map(r => {
                const st = r.status ||
                    (r.quantity === 0  ? 'out_of_stock' :
                     r.quantity <= 10  ? 'low_stock'    : 'in_stock');
                return { productName: r.productName, size: r.size, color: r.color || null, status: st };
            });
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// POST /api/orders
app.post('/api/orders', writeLimiter, async (req, res) => {
    try {
        const { customerEmail, customerName, customerPhone,
                items, total, payment, paymentStatus, address, city, pincode, orderId,
                invoiceId, trackingId, deliveredAt, addressLabel,
                razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
        if (!customerEmail || !items?.length) {
            return res.status(400).json({ ok: false, error: 'customerEmail and items required' });
        }
        const razorpay = (razorpayPaymentId || razorpayOrderId)
            ? { paymentId: razorpayPaymentId || '', orderId: razorpayOrderId || '', signature: razorpaySignature || '' }
            : null;
        const { data, error } = await supabase.from('orders').insert({
            orderId:       orderId || ('SSA' + Date.now().toString(36).toUpperCase()),
            invoiceId:     invoiceId || '',
            customerEmail, customerName, customerPhone,
            items, total, payment, address, city, pincode,
            paymentStatus: paymentStatus || '',
            status:        'Processing',
            trackingId:    trackingId  || '',
            deliveredAt:   deliveredAt || null,
            addressLabel:  addressLabel || '',
            razorpay,
            inventoryDeducted: false,
            createdAt: now(), updatedAt: now()
        }).select('id').single();
        if (error) throw new Error(error.message);
        bust('orders_all', 'admin_dashboard');
        res.json({ ok: true, id: data.id });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ── Razorpay ──────────────────────────────────────────────────────────────────
const rzpLimiter = rateLimit({ windowMs: 60_000, max: 15, standardHeaders: true, legacyHeaders: false });

// POST /api/razorpay/create-order  →  creates a Razorpay Order and returns its id
app.post('/api/razorpay/create-order', rzpLimiter, async (req, res) => {
    if (!rzp) return res.status(503).json({ ok: false, error: 'Razorpay not configured on server' });
    try {
        const { amount, currency = 'INR', receipt, notes } = req.body;
        if (!amount || Number(amount) < 100) {
            return res.status(400).json({ ok: false, error: 'amount in paise required (min 100)' });
        }
        const order = await rzp.orders.create({
            amount:          Math.round(Number(amount)),
            currency,
            receipt:         receipt || ('rcpt_' + Date.now()),
            notes:           notes || {},
            payment_capture: 1
        });
        res.json({ ok: true, data: { orderId: order.id, amount: order.amount, currency: order.currency } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// POST /api/razorpay/verify  →  verifies Razorpay payment signature (HMAC-SHA256)
app.post('/api/razorpay/verify', rzpLimiter, async (req, res) => {
    if (!RZP_KEY_SECRET) return res.status(503).json({ ok: false, error: 'Razorpay not configured on server' });
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ ok: false, error: 'order_id, payment_id and signature required' });
        }
        const expected = crypto
            .createHmac('sha256', RZP_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        if (expected !== razorpay_signature) {
            return res.status(400).json({ ok: false, verified: false, error: 'Signature mismatch' });
        }
        res.json({ ok: true, verified: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// GET /api/orders/my?email=...
app.get('/api/orders/my', publicLimiter, async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ ok: false, error: 'email required' });
        const { data, error } = await supabase
            .from('orders').select('*').eq('customerEmail', email)
            .order('createdAt', { ascending: false }).limit(50);
        if (error) throw new Error(error.message);
        res.json({ ok: true, data: data || [] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// POST /api/customers
app.post('/api/customers', writeLimiter, async (req, res) => {
    try {
        const { email, firstName, lastName, phone } = req.body;
        if (!email) return res.status(400).json({ ok: false, error: 'email required' });
        const docId = email.replace(/[^a-zA-Z0-9]/g, '_');
        const { error } = await supabase.from('customers').upsert(
            { id: docId, email, firstName, lastName, phone, updatedAt: now() },
            { onConflict: 'id' }
        );
        if (error) throw new Error(error.message);
        bust('customers_all', 'admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// POST /api/messages
app.post('/api/messages', writeLimiter, async (req, res) => {
    try {
        const { name, email, phone, message, subject } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ ok: false, error: 'name, email and message required' });
        }
        const { error } = await supabase.from('messages').insert({
            name, email, phone: phone || '', message, subject: subject || '',
            read: false, createdAt: now()
        });
        if (error) throw new Error(error.message);
        bust('admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// =============================================================
//  ADMIN AUTH MIDDLEWARE
// =============================================================
async function adminOnly(req, res, next) {
    const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
    if (!token) return res.status(401).json({ ok: false, error: 'Authorization header required' });
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) return res.status(401).json({ ok: false, error: 'Invalid or expired token' });
        if (user.email !== ADMIN_EMAIL) return res.status(403).json({ ok: false, error: 'Admin access only' });
        req.adminUser = user;
        next();
    } catch { res.status(401).json({ ok: false, error: 'Invalid or expired token' }); }
}

// =============================================================
//  ADMIN ROUTES
// =============================================================

app.get('/api/admin/dashboard', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('admin_dashboard', 30, async () => {
            const [{ data: orders }, { data: customers }, { data: inv }, { data: msgs }] = await Promise.all([
                supabase.from('orders').select('*'),
                supabase.from('customers').select('id'),
                supabase.from('inventory').select('productName,size,color,status'),
                supabase.from('messages').select('id').eq('read', false),
            ]);
            const ords = orders || [];
            return {
                totalOrders:  ords.length,
                pending:      ords.filter(o => o.status === 'Processing').length,
                revenue:      ords.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0),
                customers:    (customers || []).length,
                unreadMsgs:   (msgs || []).length,
                recentOrders: [...ords].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
                stockAlerts:  (inv || []).filter(i => (i.status || 'in_stock') !== 'in_stock'),
            };
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/orders', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('orders_all', 30, async () => {
            const { data: rows, error } = await supabase
                .from('orders').select('*').order('createdAt', { ascending: false });
            if (error) throw new Error(error.message);
            return rows || [];
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/admin/orders/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        const allowed = ['status','trackingId','address','city','pincode','deliveredAt','paymentStatus'];
        const update  = { updatedAt: now() };
        allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
        const { error } = await supabase.from('orders').update(update).eq('id', req.params.id);
        if (error) throw new Error(error.message);
        bust('orders_all', 'admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/products', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('products_all', 120, async () => {
            const { data: rows, error } = await supabase
                .from('products').select('*').order('name', { ascending: true });
            if (error) throw new Error(error.message);
            return rows || [];
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post('/api/admin/products', adminLimiter, adminOnly, async (req, res) => {
    try {
        const { data, error } = await supabase.from('products')
            .insert({ ...req.body, createdAt: now(), updatedAt: now() }).select('id').single();
        if (error) throw new Error(error.message);
        bust('products_all', 'products_' + (req.body.category || 'all'));
        res.json({ ok: true, id: data.id });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/admin/products/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        const { error } = await supabase.from('products')
            .update({ ...req.body, updatedAt: now() }).eq('id', req.params.id);
        if (error) throw new Error(error.message);
        bust('products_all', 'products_' + (req.body.category || 'all'));
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.delete('/api/admin/products/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        const { error } = await supabase.from('products').delete().eq('id', req.params.id);
        if (error) throw new Error(error.message);
        bust('products_all');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/inventory', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('inventory_all', 120, async () => {
            const { data: rows, error } = await supabase
                .from('inventory').select('*').order('productName', { ascending: true });
            if (error) throw new Error(error.message);
            return rows || [];
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/admin/inventory/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        const { error } = await supabase.from('inventory')
            .update({ status: req.body.status, updatedAt: now() }).eq('id', req.params.id);
        if (error) throw new Error(error.message);
        bust('inventory_all', 'inv_status', 'admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/customers', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('customers_all', 120, async () => {
            const { data: rows, error } = await supabase
                .from('customers').select('*').order('createdAt', { ascending: false });
            if (error) throw new Error(error.message);
            return rows || [];
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/messages', adminLimiter, adminOnly, async (req, res) => {
    try {
        const { data: rows, error } = await supabase
            .from('messages').select('*').order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        res.json({ ok: true, data: rows || [] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/admin/messages/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        const { error } = await supabase.from('messages')
            .update({ read: req.body.read ?? true }).eq('id', req.params.id);
        if (error) throw new Error(error.message);
        bust('admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 3001;
app.listen(PORT, () => console.log(`[SSA] API server listening on port ${PORT}`));
module.exports = app;
