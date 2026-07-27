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

    // ── Shared HTML email template helpers ───────────────────
    const _LOGO = 'https://lalithvishnu04.github.io/sivasureshagency/images/Images/SSA%20Logo-480.png';
    const _SITE = 'https://lalithvishnu04.github.io/sivasureshagency/';
    const _EMAIL = 'info@sivasureshagency.onmicrosoft.com';
    const _PHONE = '+91 93666 40060';

    function _emailWrap(title, accentColor, bodyRows, ctaHtml) {
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f0f4f8;font-family:'Times New Roman',Times,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);max-width:600px;">

  <!-- Header Banner -->
  <tr><td style="background:linear-gradient(135deg,${accentColor} 0%,#1e3a5f 100%);padding:36px 40px 28px;text-align:center;">
    <img src="${_LOGO}" alt="Siva Suresh Agency" height="56" style="margin-bottom:14px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.25));">
    <h1 style="margin:0;font-family:'Times New Roman',Times,serif;font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">${title}</h1>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:36px 40px 28px;">
    ${bodyRows}
    ${ctaHtml || ''}
  </td></tr>

  <!-- Signature -->
  <tr><td style="background:#f8fafc;border-top:2px solid ${accentColor}20;padding:24px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:top;">
          <p style="margin:0 0 4px;font-family:'Times New Roman',Times,serif;font-size:15px;font-weight:bold;color:#0f172a;">Siva Suresh Agency</p>
          <p style="margin:0 0 2px;font-family:'Times New Roman',Times,serif;font-size:13px;color:#64748b;font-style:italic;">Premium Healthcare &amp; Medical Uniforms Since 2010</p>
          <p style="margin:6px 0 2px;font-family:'Times New Roman',Times,serif;font-size:13px;color:#475569;">📞 ${_PHONE} &nbsp;|&nbsp; 📧 <a href="mailto:${_EMAIL}" style="color:#0d9488;text-decoration:none;">${_EMAIL}</a></p>
          <p style="margin:2px 0;font-family:'Times New Roman',Times,serif;font-size:12px;color:#94a3b8;">📍 PVT Towers, 37/10, Selvam Nagar, Erode – 638011, Tamil Nadu</p>
        </td>
        <td align="right" style="vertical-align:top;width:100px;">
          <a href="${_SITE}" style="display:inline-block;background:linear-gradient(135deg,${accentColor},#1e3a5f);color:#fff;font-family:'Times New Roman',Times,serif;font-size:12px;font-weight:bold;padding:8px 16px;border-radius:20px;text-decoration:none;">Visit Site →</a>
        </td>
      </tr>
    </table>
    <p style="margin:14px 0 0;font-family:'Times New Roman',Times,serif;font-size:11px;color:#cbd5e1;text-align:center;">This is an automated message from Siva Suresh Agency. Please do not reply directly to this email.</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
    }

    function _fieldRow(label, value) {
        if (!value) return '';
        return `<tr>
          <td style="padding:9px 14px;border-bottom:1px solid #f1f5f9;width:38%;">
            <span style="font-family:'Times New Roman',Times,serif;font-size:14px;font-weight:bold;font-style:italic;color:#475569;">${label}</span>
          </td>
          <td style="padding:9px 14px;border-bottom:1px solid #f1f5f9;">
            <span style="font-family:'Times New Roman',Times,serif;font-size:14px;color:#0f172a;">${value}</span>
          </td>
        </tr>`;
    }

    function _infoTable(rows) {
        return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin:20px 0;overflow:hidden;">${rows}</table>`;
    }

    function _badge(text, color) {
        return `<span style="display:inline-block;background:${color}18;color:${color};border:1.5px solid ${color}40;border-radius:20px;padding:3px 12px;font-family:'Times New Roman',Times,serif;font-size:13px;font-weight:bold;">${text}</span>`;
    }

    // ── Contact Form Submission ──────────────────────────────
    async function sendContactFormEmail(data) {
        const cfg = await _cfg();
        const bodyRows = `
          <p style="font-family:'Times New Roman',Times,serif;font-size:16px;color:#0f172a;margin:0 0 4px;"><b>Dear Admin,</b></p>
          <p style="font-family:'Times New Roman',Times,serif;font-size:14px;color:#475569;margin:0 0 20px;">A new support ticket has been received from your website.</p>
          ${_infoTable(
              _fieldRow('Ticket ID', `<b>${data.ticketId}</b>`) +
              _fieldRow('Customer Name', data.name) +
              _fieldRow('Email', `<a href="mailto:${data.email}" style="color:#0d9488;">${data.email}</a>`) +
              _fieldRow('Phone', data.phone || '—') +
              _fieldRow('Customer ID', data.customerId || 'Not registered') +
              _fieldRow('Subject', `<b>${data.subject || 'General Inquiry'}</b>`) +
              _fieldRow('Date', new Date().toLocaleString('en-IN', {dateStyle:'medium',timeStyle:'short'}))
          )}
          <p style="font-family:'Times New Roman',Times,serif;font-size:13px;font-weight:bold;font-style:italic;color:#475569;margin:20px 0 8px;">Message:</p>
          <div style="background:#f8fafc;border-left:4px solid #0d9488;border-radius:0 8px 8px 0;padding:14px 18px;font-family:'Times New Roman',Times,serif;font-size:14px;color:#1e293b;line-height:1.7;white-space:pre-wrap;">${data.message}</div>
          ${data.attachmentUrls && data.attachmentUrls.length ? `<p style="font-family:'Times New Roman',Times,serif;font-size:13px;color:#64748b;margin:12px 0 0;">📎 <i>Attachments:</i> ${data.attachmentUrls.map(u=>`<a href="${u}" style="color:#0d9488;">${u}</a>`).join(', ')}</p>` : ''}
        `;
        const ctaHtml = `<div style="text-align:center;margin:28px 0 0;"><a href="https://lalithvishnu04.github.io/sivasureshagency/admin.html" style="display:inline-block;background:linear-gradient(135deg,#0d9488,#1e3a5f);color:#fff;font-family:'Times New Roman',Times,serif;font-size:15px;font-weight:bold;padding:13px 32px;border-radius:30px;text-decoration:none;letter-spacing:0.3px;">Open Admin Panel →</a></div>`;
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
            emailSubject: `[${data.ticketId}] New Query: ${data.subject || 'General Inquiry'}`,
            emailBody: _emailWrap(`New Support Ticket — ${data.ticketId}`, '#0d9488', bodyRows, ctaHtml)
        });
    }

    // ── Ticket Status Update / Creation (notify customer) ───────────────
    async function sendTicketStatusUpdate(data) {
        const cfg = await _cfg();
        const trackUrl = `https://lalithvishnu04.github.io/sivasureshagency/tickets.html?id=${encodeURIComponent(data.ticketId)}`;
        const isNew = data.isNew === true;
        const statusColor = { 'Open':'#6366f1','In Progress':'#f59e0b','Resolved':'#10b981','Closed':'#94a3b8' }[data.newStatus] || '#0d9488';

        const bodyRows = isNew ? `
          <p style="font-family:'Times New Roman',Times,serif;font-size:16px;color:#0f172a;margin:0 0 4px;"><b>Dear ${data.customerName},</b></p>
          <p style="font-family:'Times New Roman',Times,serif;font-size:14px;color:#475569;margin:0 0 20px;">Your support request has been received and a ticket has been created. Our team will be in touch shortly.</p>
          ${_infoTable(
              _fieldRow('Ticket ID', `<b style="font-size:16px;color:#0d9488;">${data.ticketId}</b>`) +
              _fieldRow('Status', _badge('Open', '#6366f1')) +
              (data.adminNote ? _fieldRow('Details', `<i>${data.adminNote}</i>`) : '') +
              _fieldRow('Created', new Date().toLocaleString('en-IN', {dateStyle:'medium',timeStyle:'short'}))
          )}
          <div style="background:#f0fdfa;border:1.5px solid #ccfbf1;border-radius:10px;padding:14px 18px;margin:20px 0;font-family:'Times New Roman',Times,serif;font-size:13px;color:#0f766e;">
            💡 <b>Save your Ticket ID</b> <code style="background:#fff;border:1px solid #ccfbf1;padding:2px 8px;border-radius:4px;font-size:14px;">${data.ticketId}</code> — you can track your ticket without logging in.
          </div>
        ` : `
          <p style="font-family:'Times New Roman',Times,serif;font-size:16px;color:#0f172a;margin:0 0 4px;"><b>Dear ${data.customerName},</b></p>
          <p style="font-family:'Times New Roman',Times,serif;font-size:14px;color:#475569;margin:0 0 20px;">There has been an update on your support ticket. Please review the details below.</p>
          ${_infoTable(
              _fieldRow('Ticket ID', `<b>${data.ticketId}</b>`) +
              _fieldRow('New Status', _badge(data.newStatus, statusColor)) +
              (data.adminNote ? _fieldRow('Note from Team', `<i>${data.adminNote}</i>`) : '') +
              _fieldRow('Updated', new Date().toLocaleString('en-IN', {dateStyle:'medium',timeStyle:'short'}))
          )}
        `;
        const ctaHtml = `<div style="text-align:center;margin:28px 0 0;"><a href="${trackUrl}" style="display:inline-block;background:linear-gradient(135deg,#0d9488,#1e3a5f);color:#fff;font-family:'Times New Roman',Times,serif;font-size:15px;font-weight:bold;padding:13px 32px;border-radius:30px;text-decoration:none;letter-spacing:0.3px;">Track My Ticket →</a></div>`;
        return postWebhook(cfg.ticketStatusWebhook, {
            type: isNew ? 'ticket_created' : 'ticket_status',
            customerEmail: data.customerEmail,
            adminEmail: cfg.adminEmail,
            ticketId: data.ticketId,
            customerName: data.customerName,
            newStatus: data.newStatus,
            adminNote: data.adminNote || '',
            trackUrl,
            timestamp: new Date().toISOString(),
            emailSubject: isNew
                ? `[${data.ticketId}] ✅ Your Support Ticket Has Been Created`
                : `[${data.ticketId}] 🔔 Ticket Update: ${data.newStatus}`,
            emailBody: _emailWrap(
                isNew ? `Your Ticket Has Been Created` : `Ticket Status Updated`,
                isNew ? '#0d9488' : statusColor,
                bodyRows, ctaHtml
            )
        });
    }

    // ── Product Rating Notification ──────────────────────────
    async function sendRatingNotification(data) {
        const cfg = await _cfg();
        const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
        const bodyRows = `
          <p style="font-family:'Times New Roman',Times,serif;font-size:16px;color:#0f172a;margin:0 0 4px;"><b>Dear Admin,</b></p>
          <p style="font-family:'Times New Roman',Times,serif;font-size:14px;color:#475569;margin:0 0 20px;">A customer has submitted a product rating.</p>
          ${_infoTable(
              _fieldRow('Order ID', data.orderId) +
              _fieldRow('Product', `<b>${data.productName}</b>`) +
              _fieldRow('Rating', `<span style="font-size:20px;color:#f59e0b;letter-spacing:2px;">${stars}</span> <span style="font-size:13px;color:#64748b;">(${data.rating}/5)</span>`) +
              _fieldRow('Customer', `${data.customerName} (<a href="mailto:${data.customerEmail}" style="color:#0d9488;">${data.customerEmail}</a>)`) +
              _fieldRow('Date', new Date().toLocaleString('en-IN', {dateStyle:'medium',timeStyle:'short'}))
          )}
          ${data.comment ? `<p style="font-family:'Times New Roman',Times,serif;font-size:13px;font-weight:bold;font-style:italic;color:#475569;margin:20px 0 8px;">Customer Comment:</p><div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 18px;font-family:'Times New Roman',Times,serif;font-size:14px;color:#1e293b;line-height:1.7;">${data.comment}</div>` : ''}
          ${data.imageUrl ? `<p style="margin:16px 0 0;font-family:'Times New Roman',Times,serif;font-size:13px;color:#64748b;">📷 <i>Customer Photo:</i> <a href="${data.imageUrl}" style="color:#0d9488;">View Image</a></p>` : ''}
        `;
        const ctaHtml = `<div style="text-align:center;margin:28px 0 0;"><a href="https://lalithvishnu04.github.io/sivasureshagency/admin.html" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#b45309);color:#fff;font-family:'Times New Roman',Times,serif;font-size:15px;font-weight:bold;padding:13px 32px;border-radius:30px;text-decoration:none;">View in Admin →</a></div>`;
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
            emailSubject: `⭐ New ${data.rating}/5 Rating — ${data.productName} (Order ${data.orderId})`,
            emailBody: _emailWrap(`New Product Rating — ${stars}`, '#f59e0b', bodyRows, ctaHtml)
        });
    }

    // ── Live Agent Request (Teams notification) ──────────────
    async function requestLiveAgent(data) {
        const cfg = await _cfg();
        const bodyRows = `
          <p style="font-family:'Times New Roman',Times,serif;font-size:16px;color:#0f172a;margin:0 0 4px;"><b>🚨 Live Agent Request</b></p>
          <p style="font-family:'Times New Roman',Times,serif;font-size:14px;color:#475569;margin:0 0 20px;">A customer is requesting live support via the chatbot.</p>
          ${_infoTable(
              _fieldRow('Customer', `<b>${data.customerName}</b>`) +
              _fieldRow('Email', `<a href="mailto:${data.customerEmail}" style="color:#0d9488;">${data.customerEmail}</a>`) +
              _fieldRow('Customer ID', data.customerId || 'Guest') +
              _fieldRow('Session ID', data.sessionId || '—') +
              _fieldRow('Context', data.context || 'General support') +
              _fieldRow('Time', new Date().toLocaleString('en-IN', {dateStyle:'medium',timeStyle:'short'}))
          )}
        `;
        const ctaHtml = `<div style="text-align:center;margin:28px 0 0;"><a href="https://lalithvishnu04.github.io/sivasureshagency/admin.html" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#1e3a5f);color:#fff;font-family:'Times New Roman',Times,serif;font-size:15px;font-weight:bold;padding:13px 32px;border-radius:30px;text-decoration:none;">Open Chat in Admin →</a></div>`;
        return postWebhook(cfg.liveAgentWebhook, {
            type: 'live_agent_request',
            adminEmail: cfg.adminEmail,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerId: data.customerId || '',
            context: data.context || 'Customer requested live support via chatbot',
            sessionId: data.sessionId || generateTicketId(),
            timestamp: new Date().toISOString(),
            teamsMessage: `🚨 Live Agent Request!\nCustomer: ${data.customerName} (${data.customerEmail})\nCustomer ID: ${data.customerId || 'Guest'}\nSession: ${data.sessionId || ''}\nContext: ${data.context || 'General support'}\n\n👉 Reply via Admin UI: https://lalithvishnu04.github.io/sivasureshagency/admin.html\n(Open Messages → Chat Requests → find this session → Send Reply)`,
            emailSubject: `🚨 Live Agent Request from ${data.customerName}`,
            emailBody: _emailWrap('Live Agent Request', '#6366f1', bodyRows, ctaHtml)
        });
    }
    };
})();
