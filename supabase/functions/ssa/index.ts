// ============================================================
//  SSA Supabase Edge Function  —  supabase/functions/ssa/index.ts
//
//  Replaces the old Firebase Cloud Function.
//  Deploy:  supabase functions deploy ssa --project-ref kyzlxhncnqahlpfhtoky
//
//  Secrets needed (set once via Supabase Dashboard → Edge Functions → Secrets):
//    SSA_OTP_PEPPER  →  any random string (e.g. openssl rand -hex 32)
//
//  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.
//
//  Handles:
//    POST /api/auth/forgot-password/request
//    POST /api/auth/forgot-password/verify
// ============================================================

const ALLOWED_ORIGINS = [
  'https://lalithvishnu-hub.github.io',
  'https://lalithvishnu04.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

const OTP_TTL_MS      = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_ATTEMPT = 5;
const STRONG_PWD_RE   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

// ── Utilities ────────────────────────────────────────────────

function normalizeEmail(e: unknown): string {
  return String(e ?? '').trim().toLowerCase();
}

function randomOtp(): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(100000 + (arr[0] % 900000));
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function otpHash(challengeId: string, otp: string): Promise<string> {
  const pepper = Deno.env.get('SSA_OTP_PEPPER') ?? '';
  return sha256Hex(`${challengeId}:${otp}:${pepper}`);
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

function jsonResp(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

// ── Supabase REST helpers (no SDK needed — built-in fetch) ───

function sbHeaders(serviceKey: string): Record<string, string> {
  return { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' };
}

async function dbInsert(base: string, key: string, table: string, row: unknown): Promise<void> {
  await fetch(`${base}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...sbHeaders(key), Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  });
}

async function dbPatch(base: string, key: string, table: string, id: string, data: unknown): Promise<void> {
  await fetch(`${base}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { ...sbHeaders(key), Prefer: 'return=minimal' },
    body: JSON.stringify(data),
  });
}

async function dbGetById(base: string, key: string, table: string, id: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${base}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: sbHeaders(key),
  });
  if (!res.ok) return null;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

/** Read commWebhooks config stored by admin UI in Supabase settings table. */
async function getWebhookConfig(base: string, key: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${base}/rest/v1/settings?id=eq.commWebhooks&select=name`, {
      headers: sbHeaders(key),
    });
    if (!res.ok) return {};
    const rows = await res.json();
    if (Array.isArray(rows) && rows[0]?.name) return JSON.parse(rows[0].name);
  } catch { /* fall through */ }
  return {};
}

/** Find a Supabase Auth user by email via the Admin users API. */
async function findUserByEmail(
  authBase: string, key: string, email: string
): Promise<{ id: string } | null> {
  try {
    // GoTrue supports basic pagination; 1 000 covers virtually all small-business user bases.
    const res = await fetch(`${authBase}/admin/users?page=1&per_page=1000`, {
      headers: sbHeaders(key),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const users: Array<{ id: string; email: string }> = data.users ?? [];
    return users.find(u => (u.email ?? '').toLowerCase() === email) ?? null;
  } catch { return null; }
}

/** HTML body for the password-reset OTP email. */
function otpEmailHtml(otp: string): string {
  return `<!DOCTYPE html><html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef3f9;font-family:Segoe UI,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:26px 0;background:#eef3f9;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0"
  style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.10);">
<tr><td style="background:linear-gradient(135deg,#0e4a86,#6c63ff);padding:28px 32px;">
  <h2 style="margin:0;font-size:22px;color:#fff;font-weight:700;">Password Reset OTP</h2>
  <p style="color:rgba(255,255,255,.75);font-size:13px;margin:4px 0 0;">Siva Suresh Agency</p>
</td></tr>
<tr><td style="padding:28px 32px 24px;">
  <p style="margin:0 0 14px;color:#1f2937;font-size:15px;line-height:1.7;">
    Use the OTP below to reset your password.
  </p>
  <div style="background:#f0fdf4;border:2px solid #10b981;border-radius:8px;
               padding:18px;text-align:center;margin:18px 0;">
    <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#0f766e;">${otp}</span>
  </div>
  <p style="margin:0 0 8px;color:#334155;font-size:14px;line-height:1.6;">
    This OTP expires in <b>10 minutes</b>.
  </p>
  <p style="margin:0;color:#64748b;font-size:12px;">
    If you did not request this, please ignore this email.
  </p>
</td></tr>
<tr><td style="background:#f8fafc;padding:14px 32px;
               font-size:11px;color:#94a3b8;text-align:center;">
  &copy; Siva Suresh Agency &mdash; info@sivasureshagency.onmicrosoft.com
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/** Call the Power Automate webhook to send the OTP email. */
async function sendOtpEmail(webhookUrl: string, toEmail: string, otp: string): Promise<void> {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'password_reset_otp',
      toEmail,
      adminEmail: 'info@sivasureshagency.onmicrosoft.com',
      emailSubject: 'Siva Suresh Agency — Password Reset OTP',
      emailBody: otpEmailHtml(otp),
      otp,
    }),
  });
}

// ── Main handler ─────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const cors   = corsHeaders(origin);

  // Pre-flight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  // Extract route: strip /functions/v1/ssa (or /ssa) prefix
  const url   = new URL(req.url);
  const route = url.pathname
    .replace(/^\/functions\/v1\/ssa/, '')
    .replace(/^\/ssa/, '')
    || '/';

  const supabaseUrl = (Deno.env.get('SUPABASE_URL') ?? '').replace(/\/$/, '');
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const authBase    = `${supabaseUrl}/auth/v1`;

  if (!supabaseUrl || !serviceKey) {
    return jsonResp({ ok: false, error: 'Server misconfigured — SUPABASE_URL / SERVICE_ROLE_KEY missing.' }, 500, cors);
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body */ }

  // ── POST /api/auth/forgot-password/request ─────────────────
  if (req.method === 'POST' && route === '/api/auth/forgot-password/request') {
    const email = normalizeEmail(body?.email);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResp({ ok: false, error: 'Valid email is required.' }, 400, cors);
    }

    // Look up user (don't reveal existence — always return ok:true below)
    const user        = await findUserByEmail(authBase, serviceKey, email);
    const challengeId = crypto.randomUUID().replace(/-/g, '');
    const otp         = randomOtp();
    const hash        = await otpHash(challengeId, otp);
    const expiresAt   = Date.now() + OTP_TTL_MS;

    await dbInsert(supabaseUrl, serviceKey, 'password_reset_otps', {
      id: challengeId,
      email,
      otp_hash:    hash,
      expires_at:  expiresAt,
      attempts:    0,
      used:        false,
      user_exists: !!user,
      user_id:     user?.id ?? null,
    });

    if (user) {
      const cfg        = await getWebhookConfig(supabaseUrl, serviceKey);
      const webhookUrl = String(cfg.passwordResetOtpWebhook ?? cfg.passwordResetWebhook ?? '');
      if (!webhookUrl) {
        return jsonResp({
          ok: false,
          error: 'Password reset OTP webhook not configured. Set it in Admin → Settings → Communications → Password Reset OTP.',
        }, 503, cors);
      }
      try { await sendOtpEmail(webhookUrl, email, otp); } catch { /* log only */ }
    }

    return jsonResp({
      ok: true,
      challengeId,
      expiresInSeconds: OTP_TTL_MS / 1000,
      message: 'If the account exists, an OTP has been sent.',
    }, 200, cors);
  }

  // ── POST /api/auth/forgot-password/verify ──────────────────
  if (req.method === 'POST' && route === '/api/auth/forgot-password/verify') {
    const challengeId = String(body?.challengeId ?? '').trim();
    const email       = normalizeEmail(body?.email);
    const otp         = String(body?.otp ?? '').trim();
    const newPassword = String(body?.newPassword ?? '');

    if (!challengeId || !email || !otp) {
      return jsonResp({ ok: false, error: 'challengeId, email and otp are required.' }, 400, cors);
    }
    if (!STRONG_PWD_RE.test(newPassword)) {
      return jsonResp({ ok: false, error: 'Password must be ≥8 chars with upper, lower, number and special character.' }, 400, cors);
    }

    const row = await dbGetById(supabaseUrl, serviceKey, 'password_reset_otps', challengeId);
    if (!row)                                    return jsonResp({ ok: false, error: 'Invalid or expired OTP.' },          400, cors);
    if (row.used)                                return jsonResp({ ok: false, error: 'OTP already used. Request a new one.' }, 400, cors);
    if (Date.now() > Number(row.expires_at))     return jsonResp({ ok: false, error: 'OTP expired. Request a new one.' },   400, cors);
    if ((row.attempts as number) >= OTP_MAX_ATTEMPT) return jsonResp({ ok: false, error: 'Too many attempts. Request a new OTP.' }, 429, cors);
    if (normalizeEmail(row.email as string) !== email) return jsonResp({ ok: false, error: 'OTP does not match this email.' }, 400, cors);

    const expected = await otpHash(challengeId, otp);
    if (expected !== row.otp_hash) {
      await dbPatch(supabaseUrl, serviceKey, 'password_reset_otps', challengeId, { attempts: (row.attempts as number) + 1 });
      return jsonResp({ ok: false, error: 'Invalid OTP.' }, 400, cors);
    }

    // Mark used before updating password (prevent replay)
    await dbPatch(supabaseUrl, serviceKey, 'password_reset_otps', challengeId, { used: true, otp_hash: '' });

    // Find user id (stored at request time; fallback to live lookup)
    const userId = (row.user_id as string | null) ?? (await findUserByEmail(authBase, serviceKey, email))?.id;
    if (!userId) return jsonResp({ ok: false, error: 'User not found.' }, 404, cors);

    // Update password via Supabase Auth Admin API
    const updRes = await fetch(`${authBase}/admin/users/${userId}`, {
      method: 'PUT',
      headers: sbHeaders(serviceKey),
      body: JSON.stringify({ password: newPassword }),
    });
    if (!updRes.ok) {
      const err = await updRes.json().catch(() => ({} as Record<string, string>));
      return jsonResp({ ok: false, error: (err as Record<string, string>).message ?? 'Failed to update password.' }, 500, cors);
    }

    return jsonResp({ ok: true, message: 'Password updated successfully.' }, 200, cors);
  }

  return jsonResp({ ok: false, error: 'Not found.' }, 404, cors);
});
