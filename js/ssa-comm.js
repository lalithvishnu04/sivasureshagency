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
    // Load from localStorage (admin can update via Settings UI)
    function _cfg() {
        try {
            const saved = JSON.parse(localStorage.getItem('ssa_comm_config') || '{}');
            return {
                // Power Automate HTTP trigger → Outlook Send Email + Teams alert
                contactFormWebhook: saved.contactFormWebhook || '',
                ticketStatusWebhook: saved.ticketStatusWebhook || '',
                ratingWebhook: saved.ratingWebhook || '',
                liveAgentWebhook: saved.liveAgentWebhook || '',
                // Admin email (where all notifications go)
                adminEmail: saved.adminEmail || 'info@sivasureshagency.onmicrosoft.com'
            };
        } catch { return { adminEmail: 'info@sivasureshagency.onmicrosoft.com' }; }
    }

    function saveConfig(cfg) {
        const current = _cfg();
        localStorage.setItem('ssa_comm_config', JSON.stringify({ ...current, ...cfg }));
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
        const cfg = _cfg();
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

    // ── Ticket Status Update (notify customer) ───────────────
    async function sendTicketStatusUpdate(data) {
        // data: { ticketId, customerEmail, customerName, newStatus, adminNote }
        const cfg = _cfg();
        return postWebhook(cfg.ticketStatusWebhook, {
            type: 'ticket_status',
            toEmail: data.customerEmail,
            adminEmail: cfg.adminEmail,
            ticketId: data.ticketId,
            customerName: data.customerName,
            newStatus: data.newStatus,
            adminNote: data.adminNote || '',
            timestamp: new Date().toISOString(),
            emailSubject: `[${data.ticketId}] Status Update: ${data.newStatus}`,
            emailBody: `
Dear ${data.customerName},

Your support ticket has been updated.

Ticket ID: ${data.ticketId}
New Status: ${data.newStatus}
${data.adminNote ? 'Note from our team: ' + data.adminNote : ''}

You can track your ticket status on our website.

Thank you,
Siva Suresh Agency Support Team
info@sivasureshagency.onmicrosoft.com
            `.trim()
        });
    }

    // ── Product Rating Notification ──────────────────────────
    async function sendRatingNotification(data) {
        // data: { orderId, productName, rating, comment, customerName, customerEmail, imageUrl }
        const cfg = _cfg();
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
        const cfg = _cfg();
        return postWebhook(cfg.liveAgentWebhook, {
            type: 'live_agent_request',
            adminEmail: cfg.adminEmail,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerId: data.customerId || '',
            context: data.context || 'Customer requested live support via chatbot',
            sessionId: data.sessionId || generateTicketId(),
            timestamp: new Date().toISOString(),
            teamsMessage: `🚨 Live Agent Request!\nCustomer: ${data.customerName} (${data.customerEmail})\nContext: ${data.context || 'General support'}\nRespond via Admin chatbot or email.`,
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
        getConfig: _cfg,
        saveConfig
    };
})();
