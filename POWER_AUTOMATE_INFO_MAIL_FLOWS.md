# Power Automate Setup Guide
## Siva Suresh Agency

This document contains the full setup for all Power Automate flows using:
- Mailbox: info@sivasureshagency.onmicrosoft.com
- Website/Admin: https://lalithvishnu04.github.io/sivasureshagency/

Create the flows in this order:
1. Contact Form to Admin Mail
2. Ticket Status Update to Customer
3. Rating Alert to Admin
4. Live Agent Alert
5. Incoming Mail to Admin Messages Mail Tab
6. Admin Mail Reply from Admin Panel
7. Password Reset OTP to Customer

---

## Flow 1: Contact Form to Admin Mail

Purpose:
Receive website contact form submissions and send branded email to admin inbox.

Steps:
1. Create an Instant cloud flow.
2. Trigger: When an HTTP request is received.
3. Add Parse JSON.
4. Content: Request Body from trigger.
5. Generate schema from sample payload:

    {
      "type": "contact_form",
      "fromEmail": "info@sivasureshagency.onmicrosoft.com",
      "adminEmail": "info@sivasureshagency.onmicrosoft.com",
      "ticketId": "TKT-EXAMPLE",
      "customerName": "Customer",
      "customerEmail": "customer@mail.com",
      "customerPhone": "9999999999",
      "subject": "Need uniform",
      "message": "Message text",
      "attachmentUrls": [],
      "customerId": "CUST0001",
      "timestamp": "2026-08-01T00:00:00.000Z",
      "emailSubject": "[TKT-EXAMPLE] New Query: Need uniform",
      "emailBody": "<html>...</html>"
    }

6. Add Send an email (V2).
7. To: adminEmail.
8. Subject: emailSubject.
9. Body: emailBody.
10. Is HTML: Yes.
11. Advanced:
    - From (Send As): info@sivasureshagency.onmicrosoft.com
    - Reply-To: info@sivasureshagency.onmicrosoft.com
12. Save and copy HTTP URL.
13. Paste URL in Admin Settings under Contact Form Webhook URL.
14. Test using the website contact form.

---

## Flow 2: Ticket Status Update to Customer

Purpose:
Send branded status update emails to customer when ticket status changes.

Steps:
1. Create an Instant cloud flow.
2. Trigger: When an HTTP request is received.
3. Add Parse JSON.
4. Generate schema from sample payload:

    {
      "type": "ticket_status",
      "fromEmail": "info@sivasureshagency.onmicrosoft.com",
      "customerEmail": "customer@mail.com",
      "adminEmail": "info@sivasureshagency.onmicrosoft.com",
      "ticketId": "TKT-EXAMPLE",
      "customerName": "Customer",
      "newStatus": "In Progress",
      "adminNote": "Working on this",
      "trackUrl": "https://lalithvishnu04.github.io/sivasureshagency/tickets.html?id=TKT-EXAMPLE",
      "timestamp": "2026-08-01T00:00:00.000Z",
      "emailSubject": "[TKT-EXAMPLE] Ticket Update",
      "emailBody": "<html>...</html>"
    }

5. Add Send an email (V2):
    - To: customerEmail
    - Subject: emailSubject
    - Body: emailBody
    - Is HTML: Yes
    - From (Send As): info@sivasureshagency.onmicrosoft.com
    - Reply-To: info@sivasureshagency.onmicrosoft.com
6. Save and copy HTTP URL.
7. Paste URL in Admin Settings under Ticket Status Webhook URL.
8. Test by changing ticket status in Admin panel.

---

## Flow 3: Rating Alert to Admin

Purpose:
Send admin notification for new customer ratings.

Steps:
1. Create an Instant cloud flow.
2. Trigger: When an HTTP request is received.
3. Add Parse JSON.
4. Generate schema from sample payload:

    {
      "type": "rating",
      "fromEmail": "info@sivasureshagency.onmicrosoft.com",
      "adminEmail": "info@sivasureshagency.onmicrosoft.com",
      "orderId": "SSA123",
      "productName": "Doctor Coat",
      "rating": 5,
      "comment": "Good quality",
      "customerName": "Customer",
      "customerEmail": "customer@mail.com",
      "imageUrl": "",
      "timestamp": "2026-08-01T00:00:00.000Z",
      "emailSubject": "New 5/5 Rating",
      "emailBody": "<html>...</html>"
    }

5. Add Send an email (V2):
    - To: adminEmail
    - Subject: emailSubject
    - Body: emailBody
    - Is HTML: Yes
    - From (Send As): info@sivasureshagency.onmicrosoft.com
6. Save and copy HTTP URL.
7. Paste URL in Admin Settings under Rating Webhook URL.
8. Test by submitting a rating from frontend.

---

## Flow 4: Live Agent Alert

Purpose:
Notify admin about live-agent request.

Steps:
1. Create an Instant cloud flow.
2. Trigger: When an HTTP request is received.
3. Add Parse JSON.
4. Generate schema from sample payload:

    {
      "type": "live_agent_request",
      "fromEmail": "info@sivasureshagency.onmicrosoft.com",
      "adminEmail": "info@sivasureshagency.onmicrosoft.com",
      "customerName": "Customer",
      "customerEmail": "customer@mail.com",
      "customerId": "CUST0001",
      "context": "Need size help",
      "sessionId": "SESSION1",
      "timestamp": "2026-08-01T00:00:00.000Z",
      "teamsMessage": "Live agent request text",
      "emailSubject": "Live Agent Request",
      "emailBody": "<html>...</html>"
    }

5. Choose one or both actions:
    - Send Teams message
    - Send an email (V2) to adminEmail with emailSubject/emailBody
6. If using email action, set:
    - Is HTML: Yes
    - From (Send As): info@sivasureshagency.onmicrosoft.com
7. Save and copy HTTP URL.
8. Paste URL in Admin Settings under Live Agent Webhook URL.
9. Test by requesting live agent in chatbot.

---

## Flow 5: Incoming Mail to Admin Messages Mail Tab

Purpose:
Any external mail sent to info@sivasureshagency.onmicrosoft.com should appear in Admin panel Mail tab.

Steps:
1. Create an Automated cloud flow.
2. Trigger: When a new email arrives (V3).
3. Mailbox: info@sivasureshagency.onmicrosoft.com.
4. Add optional filter condition to prevent loops:
    - If sender equals info@sivasureshagency.onmicrosoft.com, skip.
5. Add HTTP action:
    - Method: POST
    - URI: https://kyzlxhncnqahlpfhtoky.supabase.co/rest/v1/messages
    - Headers:

        apikey: <your-supabase-key>
        Authorization: Bearer <your-supabase-key>
        Content-Type: application/json
        Prefer: return=representation

6. Body mapping:

    {
      "name": "@{triggerBody()?['from']}",
      "email": "@{triggerBody()?['from']}",
      "subject": "@{triggerBody()?['subject']}",
      "message": "@{triggerBody()?['body']}",
      "type": "inbound_email",
      "status": "Unread",
      "read": false,
      "createdAt": "@{utcNow()}",
      "updatedAt": "@{utcNow()}"
    }

7. Save and turn on flow.
8. Send test mail from personal mail to info@.
9. Verify it appears in Admin Messages Mail tab.

Notes:
- If trigger body fields differ in your tenant, map from dynamic content picker.
- Use sender address field (not display name) for email if available.

---

## Flow 6: Admin Mail Reply from Admin Panel

Purpose:
When admin replies inside Mail tab, send branded HTML email from info@sivasureshagency.onmicrosoft.com.

Steps:
1. Create an Instant cloud flow.
2. Trigger: When an HTTP request is received.
3. Add Parse JSON.
4. Generate schema from sample payload:

    {
      "type": "admin_email_reply",
      "fromEmail": "info@sivasureshagency.onmicrosoft.com",
      "fromName": "Siva Suresh Agency",
      "to": "customer@mail.com",
      "toName": "Customer",
      "subject": "Re: Subject",
      "emailBody": "<html>...</html>",
      "plainBody": "text",
      "timestamp": "2026-08-01T00:00:00.000Z"
    }

5. Add Send an email (V2):
    - To: to
    - Subject: subject
    - Body: emailBody
    - Is HTML: Yes
    - From (Send As): info@sivasureshagency.onmicrosoft.com
    - Reply-To: info@sivasureshagency.onmicrosoft.com
6. Save and copy HTTP URL.
7. Paste URL in Admin Settings under Mail Reply Webhook URL.
8. Test from Admin Messages Mail tab by sending a reply.

---

## Flow 7: Password Reset OTP to Customer

Purpose:
Send secure 6-digit OTP from info@sivasureshagency.onmicrosoft.com for forgot-password reset.

Steps:
1. Create an Instant cloud flow.
2. Trigger: When an HTTP request is received.
3. Add Parse JSON.
4. Generate schema from sample payload:

        {
            "type": "password_reset_otp",
            "fromEmail": "info@sivasureshagency.onmicrosoft.com",
            "to": "customer@mail.com",
            "toEmail": "customer@mail.com",
            "emailSubject": "Siva Suresh Agency - Password Reset OTP",
            "emailBody": "<html>...</html>",
            "otp": "123456",
            "expiresInMinutes": 10,
            "timestamp": "2026-08-01T00:00:00.000Z"
        }

5. Add Send an email (V2):
        - To: toEmail (or to)
        - Subject: emailSubject
        - Body: emailBody
        - Is HTML: Yes
        - From (Send As): info@sivasureshagency.onmicrosoft.com
        - Reply-To: info@sivasureshagency.onmicrosoft.com
6. Save and copy HTTP URL.
7. Paste URL in Admin -> Settings -> Communication Settings -> Password Reset OTP.
8. Test by triggering forgot-password in website login modal.

---

## Common hardening for all HTTP-trigger flows

1. Add Try/Catch scopes.
2. In Catch scope:
    - Log failure (optional)
    - Return HTTP 500 response
3. In success path:
    - Return HTTP 200 response
4. Keep flow names clear and consistent.
5. Turn on flow run history retention as needed.

Suggested names:
- SSA Contact Form Mail
- SSA Ticket Status Mail
- SSA Rating Alert
- SSA Live Agent Alert
- SSA Inbox to Supabase
- SSA Admin Mail Reply

---

## Final verification checklist

1. Contact form sends email from info@.
2. Ticket status update sends from info@.
3. Rating alert sends from info@.
4. Live agent alert works.
5. Incoming external mail appears in Admin Mail tab.
6. Admin reply from Mail tab sends from info@.
7. Branding/logo renders in outgoing HTML emails.
8. Forgot-password OTP email sends from info@ and reset completes on-site.
