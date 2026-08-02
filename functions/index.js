// ============================================================
//  SSA Cloud Functions  —  functions/index.js
//
//  Runs entirely inside Firebase (no external server needed).
//  Requires Blaze (pay-as-you-go) plan.
//
//  Deploy:   firebase deploy --only functions
//  URL:      https://us-central1-siva-suresh-agency.cloudfunctions.net/ssa
//
//  After deploy, set in js/api.js:
//    const SSA_API_BASE = 'https://us-central1-siva-suresh-agency.cloudfunctions.net/ssa';
// ============================================================

const functions   = require('firebase-functions');
const express     = require('express');
const cors        = require('cors');
const compression = require('compression');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const NodeCache   = require('node-cache');
const admin       = require('firebase-admin');
const crypto      = require('crypto');

// ── Firebase Admin (auto-initializes with Function's service account) ─────────
admin.initializeApp();
const db = admin.firestore();
// Named database used by this project
db.settings({ databaseId: 'sivasureshagency' });

// ── In-memory cache (benefit warm instances; cleared on cold start) ───────────
const cache = new NodeCache({ stdTTL: 120, checkperiod: 60 });

async function cached(key, ttl, fetcher) {
    const hit = cache.get(key);
    if (hit !== undefined) { functions.logger.info(`[cache] HIT  ${key}`); return hit; }
    functions.logger.info(`[cache] MISS ${key}`);
    const data = await fetcher();
    cache.set(key, data, ttl);
    return data;
}
function bust(...keys) { keys.forEach(k => cache.del(k)); }

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();

const ORIGINS = [
    'https://lalithvishnu-hub.github.io',
    'https://lalithvishnu04.github.io',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());

const publicLimiter = rateLimit({ windowMs: 60_000, max: 60,  standardHeaders: true, legacyHeaders: false, message: { ok: false, error: 'Too many requests.' } });
const adminLimiter  = rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false, message: { ok: false, error: 'Too many requests.' } });
const writeLimiter  = rateLimit({ windowMs: 60_000, max: 20,  standardHeaders: true, legacyHeaders: false, message: { ok: false, error: 'Too many write requests.' } });

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || ORIGINS.includes(origin)) return cb(null, true);
        cb(new Error('CORS: ' + origin));
    },
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function _normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
}

function _isStrongPassword(password) {
        return STRONG_PASSWORD_REGEX.test(String(password || ''));
}

function _randomOtp() {
        return String(Math.floor(100000 + Math.random() * 900000));
}

function _otpHash(challengeId, otp) {
        const pepper = process.env.SSA_OTP_PEPPER || '';
        return crypto
                .createHash('sha256')
                .update(`${challengeId}:${otp}:${pepper}`)
                .digest('hex');
}

function _supabaseAdminHeaders() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    return {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
    };
}

function _supabaseAuthBaseUrl() {
    const url = process.env.SUPABASE_URL || '';
    return url ? `${url.replace(/\/$/, '')}/auth/v1` : '';
}

function _ensureSupabaseAdminConfigured() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in functions environment.');
    }
}

async function _supabaseAdminRequest(path, options) {
    _ensureSupabaseAdminConfigured();
    const base = _supabaseAuthBaseUrl();
    const res = await fetch(base + path, {
        method: options?.method || 'GET',
        headers: _supabaseAdminHeaders(),
        body: options?.body ? JSON.stringify(options.body) : undefined
    });
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
    if (!res.ok) {
        throw new Error(`Supabase admin request failed (${res.status}): ${json?.msg || json?.error_description || json?.error || text || 'unknown error'}`);
    }
    return json;
}

async function _supabaseFindUserByEmail(email) {
    const data = await _supabaseAdminRequest(`/admin/users?email=${encodeURIComponent(email)}`);
    const users = Array.isArray(data?.users)
        ? data.users
        : (Array.isArray(data) ? data : []);
    return users.find(u => _normalizeEmail(u?.email) === _normalizeEmail(email)) || null;
}

async function _supabaseUpdatePassword(userId, newPassword) {
    await _supabaseAdminRequest(`/admin/users/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        body: { password: newPassword }
    });
}

async function _getCommWebhookConfig() {
        try {
                const d = await db.collection('settings').doc('commWebhooks').get();
                if (!d.exists) return {};
                return JSON.parse(d.data().name || '{}');
        } catch (e) {
                functions.logger.warn('[auth-reset] failed to load webhook config', e.message || e);
                return {};
        }
}

function _resetOtpEmailHtml(otpCode) {
        const otp = String(otpCode || '');
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#eef3f9;font-family:Segoe UI,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:26px 0;background:#eef3f9;">
        <tr>
            <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 18px 48px rgba(2,6,23,0.14);">
                    <tr>
                        <td style="padding:28px 30px;background:linear-gradient(135deg,#0d9488 0%,#164e63 100%);color:#fff;">
                            <h2 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;">Password Reset OTP</h2>
                            <p style="margin:8px 0 0;font-size:13px;opacity:0.9;">Siva Suresh Agency Account Security</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 30px;">
                            <p style="margin:0 0 14px;color:#1f2937;font-size:15px;line-height:1.7;">Use the OTP below to reset your password.</p>
                            <div style="text-align:center;padding:18px 14px;border-radius:14px;border:1px solid #c6f0eb;background:#f0fdfa;margin-bottom:14px;">
                                <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#0f766e;">${otp}</span>
                            </div>
                            <p style="margin:0 0 8px;color:#334155;font-size:14px;line-height:1.6;">This OTP expires in <b>10 minutes</b>.</p>
                            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">If you did not request this reset, please ignore this email.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:18px 30px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
                            Sent via info@sivasureshagency.onmicrosoft.com
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

async function _sendResetOtpEmail({ webhookUrl, toEmail, otp }) {
        const payload = {
                type: 'password_reset_otp',
                fromEmail: 'info@sivasureshagency.onmicrosoft.com',
                to: toEmail,
                toEmail,
                emailSubject: 'Siva Suresh Agency - Password Reset OTP',
                emailBody: _resetOtpEmailHtml(otp),
                otp,
                expiresInMinutes: 10,
                timestamp: new Date().toISOString()
        };

        const r = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
        });

        if (!r.ok) {
                const txt = await r.text().catch(() => '');
                throw new Error(`Webhook send failed (${r.status}) ${txt}`.trim());
        }
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, ts: Date.now(), cacheKeys: cache.keys().length }));

// =============================================================
//  PUBLIC ROUTES
// =============================================================

// GET /api/products[?category=doctor-uniform&limit=100]
app.get('/api/products', publicLimiter, async (req, res) => {
    try {
        const { category, limit: lim = 100 } = req.query;
        const key = 'products_' + (category || 'all');
        const data = await cached(key, 300, async () => {
            let q = db.collection('products');
            if (category) q = q.where('category', '==', category);
            const snap = await q.limit(parseInt(lim)).get();
            return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
        });
        res.json({ ok: true, data, count: data.length });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// GET /api/inventory/status — lightweight status-only list for stock badges
app.get('/api/inventory/status', publicLimiter, async (req, res) => {
    try {
        const data = await cached('inv_status', 180, async () => {
            const snap = await db.collection('inventory').get();
            return snap.docs.map(d => {
                const { productName, size, color, status, quantity } = d.data();
                const st = status ||
                    (quantity === 0  ? 'out_of_stock' :
                     quantity <= 10  ? 'low_stock'    : 'in_stock');
                return { productName, size, color: color || null, status: st };
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
                trackingId, deliveredAt, addressLabel } = req.body;
        if (!customerEmail || !items?.length) {
            return res.status(400).json({ ok: false, error: 'customerEmail and items required' });
        }
        const ref = await db.collection('orders').add({
            orderId:       orderId || ('SSA' + Date.now().toString(36).toUpperCase()),
            customerEmail, customerName, customerPhone,
            items, total, payment, address, city, pincode,
            paymentStatus: paymentStatus || '',
            status:     'Processing',
            trackingId: trackingId || '',
            deliveredAt: deliveredAt || null,
            addressLabel: addressLabel || '',
            createdAt:  admin.firestore.FieldValue.serverTimestamp(),
            updatedAt:  admin.firestore.FieldValue.serverTimestamp()
        });
        bust('orders_all', 'admin_dashboard');
        res.json({ ok: true, id: ref.id });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// GET /api/orders/my?email=...
app.get('/api/orders/my', publicLimiter, async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ ok: false, error: 'email required' });
        const snap = await db.collection('orders')
            .where('customerEmail', '==', email)
            .limit(50)
            .get();
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// POST /api/customers
app.post('/api/customers', writeLimiter, async (req, res) => {
    try {
        const { email, firstName, lastName, phone } = req.body;
        if (!email) return res.status(400).json({ ok: false, error: 'email required' });
        const docId = email.replace(/[^a-zA-Z0-9]/g, '_');
        await db.collection('customers').doc(docId).set(
            { email, firstName, lastName, phone, createdAt: admin.firestore.FieldValue.serverTimestamp() },
            { merge: true }
        );
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
        await db.collection('messages').add({
            name, email, phone: phone || '', message, subject: subject || '',
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        bust('admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// POST /api/auth/forgot-password/request
// Sends OTP email through Power Automate flow (info@ mailbox).
app.post('/api/auth/forgot-password/request', publicLimiter, async (req, res) => {
    try {
        const email = _normalizeEmail(req.body?.email);
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ ok: false, error: 'Valid email is required' });
        }

        const challengeId = crypto.randomBytes(16).toString('hex');
        const otp = _randomOtp();
        const otpHash = _otpHash(challengeId, otp);

        let userExists = true;
        try {
            const user = await _supabaseFindUserByEmail(email);
            userExists = !!user;
        } catch (e) {
            functions.logger.error('[auth-reset] supabase user lookup failed', e.message || e);
            return res.status(503).json({ ok: false, error: 'Password reset service is temporarily unavailable.' });
        }
        if (!userExists) {
            functions.logger.info('[auth-reset] request for non-existing account', { email });
        }

        const expiresAt = Date.now() + OTP_TTL_MS;
        await db.collection('password_reset_otps').doc(challengeId).set({
            email,
            otpHash,
            expiresAt,
            attempts: 0,
            used: false,
            userExists,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        if (userExists) {
            const cfg = await _getCommWebhookConfig();
            const webhookUrl = cfg.passwordResetOtpWebhook || cfg.passwordResetWebhook || '';
            if (!webhookUrl) {
                return res.status(503).json({ ok: false, error: 'Password reset OTP webhook is not configured in admin settings.' });
            }
            await _sendResetOtpEmail({ webhookUrl, toEmail: email, otp });
        }

        return res.json({
            ok: true,
            challengeId,
            expiresInSeconds: OTP_TTL_MS / 1000,
            message: 'If the account exists, an OTP has been sent.'
        });
    } catch (e) {
        functions.logger.error('[auth-reset] request failed', e);
        return res.status(500).json({ ok: false, error: 'Failed to send OTP. Please try again.' });
    }
});

// POST /api/auth/forgot-password/verify
// Verifies OTP and updates password in Supabase Auth using service-role admin APIs.
app.post('/api/auth/forgot-password/verify', publicLimiter, async (req, res) => {
    try {
        const challengeId = String(req.body?.challengeId || '').trim();
        const email = _normalizeEmail(req.body?.email);
        const otp = String(req.body?.otp || '').trim();
        const newPassword = String(req.body?.newPassword || '');

        if (!challengeId || !email || !otp) {
            return res.status(400).json({ ok: false, error: 'challengeId, email and otp are required' });
        }
        if (!_isStrongPassword(newPassword)) {
            return res.status(400).json({ ok: false, error: 'Password must be at least 8 chars with upper, lower, number and special character.' });
        }

        const ref = db.collection('password_reset_otps').doc(challengeId);
        const snap = await ref.get();
        if (!snap.exists) {
            return res.status(400).json({ ok: false, error: 'Invalid or expired OTP.' });
        }

        const row = snap.data() || {};
        if (row.used) return res.status(400).json({ ok: false, error: 'OTP already used. Request a new one.' });
        if (Date.now() > Number(row.expiresAt || 0)) return res.status(400).json({ ok: false, error: 'OTP expired. Request a new one.' });
        if ((row.attempts || 0) >= OTP_MAX_ATTEMPTS) return res.status(429).json({ ok: false, error: 'Too many attempts. Request a new OTP.' });
        if (_normalizeEmail(row.email) !== email) return res.status(400).json({ ok: false, error: 'OTP does not match this email.' });

        const expected = _otpHash(challengeId, otp);
        if (expected !== row.otpHash) {
            await ref.update({ attempts: admin.firestore.FieldValue.increment(1) });
            return res.status(400).json({ ok: false, error: 'Invalid OTP.' });
        }

        let user;
        try {
            user = await _supabaseFindUserByEmail(email);
        } catch (e) {
            functions.logger.error('[auth-reset] supabase user lookup failed during verify', e.message || e);
            return res.status(503).json({ ok: false, error: 'Password reset service is temporarily unavailable.' });
        }
        if (!user || !user.id) {
            return res.status(400).json({ ok: false, error: 'Account not found for this email.' });
        }

        await _supabaseUpdatePassword(user.id, newPassword);

        await ref.update({
            used: true,
            usedAt: admin.firestore.FieldValue.serverTimestamp(),
            otpHash: admin.firestore.FieldValue.delete()
        });

        return res.json({ ok: true, message: 'Password reset successful.' });
    } catch (e) {
        functions.logger.error('[auth-reset] verify failed', e);
        return res.status(500).json({ ok: false, error: 'Failed to reset password.' });
    }
});

// =============================================================
//  ADMIN AUTH MIDDLEWARE
// =============================================================
const ADMIN_EMAIL = 'admin@sivasureshagency.com';

async function adminOnly(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) return res.status(401).json({ ok: false, error: 'Authorization header required' });
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        if (decoded.email !== ADMIN_EMAIL) {
            return res.status(403).json({ ok: false, error: 'Admin access only' });
        }
        req.admin = decoded;
        next();
    } catch { res.status(401).json({ ok: false, error: 'Invalid or expired token' }); }
}

// =============================================================
//  ADMIN ROUTES
// =============================================================

app.get('/api/admin/dashboard', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('admin_dashboard', 30, async () => {
            const [ordSnap, cusSnap, invSnap, msgSnap] = await Promise.all([
                db.collection('orders').get(),
                db.collection('customers').get(),
                db.collection('inventory').get(),
                db.collection('messages').where('read', '==', false).get()
            ]);
            const orders = ordSnap.docs.map(d => d.data());
            return {
                totalOrders:  orders.length,
                pending:      orders.filter(o => o.status === 'Processing').length,
                revenue:      orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0),
                customers:    cusSnap.size,
                unreadMsgs:   msgSnap.size,
                recentOrders: ordSnap.docs.map(d => ({ docId: d.id, ...d.data() }))
                    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                    .slice(0, 5),
                stockAlerts:  invSnap.docs.map(d => d.data())
                    .filter(i => (i.status || 'in_stock') !== 'in_stock')
                    .map(i => ({ productName: i.productName, size: i.size, color: i.color, status: i.status }))
            };
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/orders', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('orders_all', 30, async () => {
            const snap = await db.collection('orders').get();
            return snap.docs.map(d => ({ docId: d.id, ...d.data() }))
                .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/admin/orders/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        const { status, trackingId, address, city, pincode, deliveredAt, paymentStatus } = req.body;
        const update = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
        if (status     !== undefined) update.status     = status;
        if (trackingId !== undefined) update.trackingId = trackingId;
        if (address    !== undefined) update.address    = address;
        if (city       !== undefined) update.city       = city;
        if (pincode    !== undefined) update.pincode    = pincode;
        if (deliveredAt !== undefined) update.deliveredAt = deliveredAt;
        if (paymentStatus !== undefined) update.paymentStatus = paymentStatus;
        await db.collection('orders').doc(req.params.id).update(update);
        bust('orders_all', 'admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/products', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('products_all', 120, async () => {
            const snap = await db.collection('products').get();
            return snap.docs.map(d => ({ docId: d.id, ...d.data() }))
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post('/api/admin/products', adminLimiter, adminOnly, async (req, res) => {
    try {
        const ref = await db.collection('products').add({
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        bust('products_all', 'products_' + (req.body.category || 'all'));
        res.json({ ok: true, id: ref.id });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/admin/products/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        await db.collection('products').doc(req.params.id).update({
            ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        bust('products_all', 'products_' + (req.body.category || 'all'));
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.delete('/api/admin/products/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        await db.collection('products').doc(req.params.id).delete();
        bust('products_all');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/inventory', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('inventory_all', 120, async () => {
            const snap = await db.collection('inventory').get();
            return snap.docs.map(d => ({ docId: d.id, ...d.data() }))
                .sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/admin/inventory/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        await db.collection('inventory').doc(req.params.id).update({
            status: req.body.status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        bust('inventory_all', 'inv_status', 'admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/customers', adminLimiter, adminOnly, async (req, res) => {
    try {
        const data = await cached('customers_all', 120, async () => {
            const snap = await db.collection('customers').get();
            return snap.docs.map(d => ({ docId: d.id, ...d.data() }))
                .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        });
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/admin/messages', adminLimiter, adminOnly, async (req, res) => {
    try {
        const snap = await db.collection('messages').get();
        const data = snap.docs.map(d => ({ docId: d.id, ...d.data() }))
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        res.json({ ok: true, data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/admin/messages/:id', adminLimiter, adminOnly, async (req, res) => {
    try {
        await db.collection('messages').doc(req.params.id).update({ read: req.body.read ?? true });
        bust('admin_dashboard');
        res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ── Export as Firebase Function (function name: "ssa") ────────────────────────
// URL: https://us-central1-siva-suresh-agency.cloudfunctions.net/ssa
exports.ssa = functions.https.onRequest(app);
