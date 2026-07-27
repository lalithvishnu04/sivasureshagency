// ============================================================
//  SSA Communications — ssa-comm.js
//
//  Central module for all email / Teams / ticket communication.
//  Uses Power Automate HTTP-trigger flows.
//
//  SETUP: Replace placeholder URLs below with actual
//  Power Automate flow HTTP trigger URLs.
//  These can also be updated from Admin → Settings panel.
// ============================================================

window.SSA_COMM = (function () {
    // ── Configurable Webhook URLs ────────────────────────────
    // IMPORTANT: webhook URLs used to be stored in localStorage only, which
    // meant they were scoped to a single browser (usually the admin's own).
    // Any customer visiting the live site from a different browser/device
    // always saw an EMPTY config, so postWebhook() silently no-opped and
    // Power Automate never received a request (confirmed: 0 flow runs ever).
    // Fix: persist the config in Supabase `settings` (shared by everyone),
    // with localStorage kept only as a fast local cache / offline fallback.
    const _CFG_DOC = 'commWebhooks';
    const _CFG_TTL = 5 * 60 * 1000; // 5 min in-memory cache
    let _cfgCache = null;
    let _cfgCacheAt = 0;

    function _localCfg() {
        try { return JSON.parse(localStorage.getItem('ssa_comm_config') || '{}'); } catch { return {}; }
    }

    function _defaults(overrides) {
        return {
            contactFormWebhook: '',
            ticketStatusWebhook: '',
            ratingWebhook: '',
            liveAgentWebhook: '',
            adminEmail: 'info@sivasureshagency.onmicrosoft.com',
            ...overrides
        };
    }

    async function _cfg() {
        const now = Date.now();
        if (_cfgCache && (now - _cfgCacheAt) < _CFG_TTL) return _cfgCache;

        let remote = null;
        try {
            if (window.db) {
                const doc = await window.db.collection('settings').doc(_CFG_DOC).get();
                if (doc && doc.exists) remote = JSON.parse(doc.data().name || '{}');
            }
        } catch (e) {
            console.warn('[SSA-COMM] Could not load shared webhook config from Supabase:', e.message);
        }

        const local = _localCfg();
        const merged = _defaults({
            contactFormWebhook: remote?.contactFormWebhook || local.contactFormWebhook || '',
            ticketStatusWebhook: remote?.ticketStatusWebhook || local.ticketStatusWebhook || '',
            ratingWebhook: remote?.ratingWebhook || local.ratingWebhook || '',
            liveAgentWebhook: remote?.liveAgentWebhook || local.liveAgentWebhook || '',
            adminEmail: remote?.adminEmail || local.adminEmail || undefined
        });
        _cfgCache = merged;
        _cfgCacheAt = now;
        return merged;
    }

    // Synchronous best-effort read (cache or localStorage) — used only for
    // instantly pre-filling the Admin Settings form before the async load
    // finishes; never relied on for actually sending webhooks.
    function _cfgSync() {
        if (_cfgCache) return _cfgCache;
        return _defaults(_localCfg());
    }

    async function saveConfig(cfg) {
        const current = await _cfg();
        const merged = { ...current, ...cfg };
        _cfgCache = merged;
        _cfgCacheAt = Date.now();
        // Local cache for instant reload / offline
        try { localStorage.setItem('ssa_comm_config', JSON.stringify(merged)); } catch { /* ignore */ }
        // Shared source of truth — every visitor's browser reads this
        if (window.db) {
            await window.db.collection('settings').doc(_CFG_DOC).set({ name: JSON.stringify(merged) }, { merge: true });
        } else {
            throw new Error('Database not ready — webhook URLs saved locally only. Reload and try again.');
        }
    }

    // ── Ticket ID Generator ──────────────────────────────────
    function generateTicketId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
        return 'TKT-' + ts + rand;
    }

    // ── Generic Webhook POST ─────────────────────────────────
    // Uses no-cors mode so the POST always reaches Power Automate
    // even when the trigger URL doesn't return CORS headers.
    // Power Automate flow: use json(triggerBody()) to parse the payload.
    async function postWebhook(url, payload) {
        if (!url) {
            console.warn('[SSA-COMM] Webhook URL not configured for:', payload.type || 'unknown');
            return false;
        }
        try {
            // Try normal fetch first (works when PA returns CORS headers)
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return true;
        } catch (e) {
            // CORS blocked — retry with no-cors so the request still reaches Power Automate
            try {
                await fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(payload)
                });
                return true;
            } catch (e2) {
                console.warn('[SSA-COMM] Webhook failed:', e2.message);
                return false;
            }
        }
    }

    // ── Contact Form Submission ──────────────────────────────
    async function sendContactFormEmail(data) {
        // data: { ticketId, name, email, phone, subject, message, attachmentUrls, customerIdStr }
        const cfg = await _cfg();
        return postWebhook(cfg.contactFormWebhook, {
            type: 'contact_form',
            adminEmail: cfg.adminEmail,
            ticketId: data.ticketId,
            customerName: data.name,
            customerEmail: data.email,
            customerPhone: data.phone,
            subject: data.subject || 'General Inquiry',
            message: data.message,
            attachmentUrls: data.attachmentUrls || [],
            customerId: data.customerId || '',
            timestamp: new Date().toISOString(),
            // Email template hint for Power Automate
            emailSubject: `[${data.ticketId}] New Query: ${data.subject || 'General Inquiry'}`,
            emailBody: `
New support ticket received from your website.

Ticket ID: ${data.ticketId}
Customer: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject || 'General Inquiry'}
Customer ID: ${data.customerId || 'Not registered'}

Message:
${data.message}

${data.attachmentUrls && data.attachmentUrls.length ? 'Attachments: ' + data.attachmentUrls.join(', ') : ''}

Reply to this ticket from your Admin panel: https://lalithvishnu04.github.io/sivasureshagency/admin.html
            `.trim()
        });
    }

    // ── Ticket Status Update / Creation (notify customer) ───────────────
    async function sendTicketStatusUpdate(data) {
        // data: { ticketId, customerEmail, customerName, newStatus, adminNote, isNew? }
        const cfg = await _cfg();
        const trackUrl = `https://lalithvishnu04.github.io/sivasureshagency/tickets.html?id=${encodeURIComponent(data.ticketId)}`;
        const isNew = data.isNew === true;
        return postWebhook(cfg.ticketStatusWebhook, {
            type: isNew ? 'ticket_created' : 'ticket_status',
            toEmail: data.customerEmail,
            adminEmail: cfg.adminEmail,
            ticketId: data.ticketId,
            customerName: data.customerName,
            newStatus: data.newStatus,
            adminNote: data.adminNote || '',
            trackUrl,
            timestamp: new Date().toISOString(),
            emailSubject: isNew
                ? `[${data.ticketId}] Your Support Ticket Has Been Created`
                : `[${data.ticketId}] Ticket Update: ${data.newStatus}`,
            emailBody: isNew ? `
Dear ${data.customerName},

A support ticket has been created for you by our team.

Ticket ID : ${data.ticketId}
Status    : Open
${data.adminNote ? 'Details   : ' + data.adminNote : ''}

Track your ticket anytime here:
${trackUrl}

Save your Ticket ID (${data.ticketId}) to look it up without logging in.

Thank you,
Siva Suresh Agency Support Team
info@sivasureshagency.onmicrosoft.com
            `.trim() : `
Dear ${data.customerName},

Your support ticket has been updated.

Ticket ID  : ${data.ticketId}
New Status : ${data.newStatus}
${data.adminNote ? 'Note       : ' + data.adminNote : ''}

Track your ticket here:
${trackUrl}

Thank you,
Siva Suresh Agency Support Team
info@sivasureshagency.onmicrosoft.com
            `.trim()
        });
    }

    // ── Product Rating Notification ──────────────────────────
    async function sendRatingNotification(data) {
        // data: { orderId, productName, rating, comment, customerName, customerEmail, imageUrl }
        const cfg = await _cfg();
        return postWebhook(cfg.ratingWebhook, {
            type: 'rating',
            adminEmail: cfg.adminEmail,
            orderId: data.orderId,
            productName: data.productName,
            rating: data.rating,
            comment: data.comment || '',
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            imageUrl: data.imageUrl || '',
            timestamp: new Date().toISOString(),
            emailSubject: `New ${data.rating}★ Rating for ${data.productName} (Order ${data.orderId})`,
            emailBody: `
A customer has submitted a rating.

Order ID: ${data.orderId}
Product: ${data.productName}
Rating: ${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)} (${data.rating}/5)
Customer: ${data.customerName} (${data.customerEmail})

Comment:
${data.comment || '(No comment)'}

${data.imageUrl ? 'Photo: ' + data.imageUrl : ''}

View in Admin: https://lalithvishnu04.github.io/sivasureshagency/admin.html
            `.trim()
        });
    }

    // ── Live Agent Request (Teams notification) ──────────────
    async function requestLiveAgent(data) {
        // data: { customerName, customerEmail, customerId, context, sessionId }
        const cfg = await _cfg();
        return postWebhook(cfg.liveAgentWebhook, {
            type: 'live_agent_request',
            adminEmail: cfg.adminEmail,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerId: data.customerId || '',
            context: data.context || 'Customer requested live support via chatbot',
            sessionId: data.sessionId || generateTicketId(),
            timestamp: new Date().toISOString(),
            teamsMessage: `🚨 Live Agent Request!\nCustomer: ${data.customerName} (${data.customerEmail})\nCustomer ID: ${data.customerId || 'Guest'}\nSession: ${data.sessionId || ''}\nContext: ${data.context || 'General support'}\n\n👉 Reply via Admin UI: https://lalithvishnu04.github.io/sivasureshagency/admin.html\n(Open Messages → Chat Requests → find this session → Send Reply & Email)`,
            emailSubject: `Live Agent Request from ${data.customerName}`,
            emailBody: `
A customer is requesting live support via the chatbot.

Customer: ${data.customerName}
Email: ${data.customerEmail}
Customer ID: ${data.customerId || 'Guest'}
Context: ${data.context || 'General support'}

Please respond on Microsoft Teams or via email.
            `.trim()
        });
    }

    // Public API
    return {
        generateTicketId,
        sendContactFormEmail,
        sendTicketStatusUpdate,
        sendRatingNotification,
        requestLiveAgent,
        getConfig: _cfg,       // async — always fresh/shared (Supabase)
        getConfigSync: _cfgSync, // sync best-effort — UI pre-fill only
        saveConfig
    };
})();
