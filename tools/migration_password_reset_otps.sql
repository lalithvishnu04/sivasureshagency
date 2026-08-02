-- Run this once in Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Creates the table used by the Supabase Edge Function for password-reset OTP challenges.

CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id          TEXT        PRIMARY KEY,           -- challengeId (hex UUID, no dashes)
  email       TEXT        NOT NULL,
  otp_hash    TEXT        NOT NULL DEFAULT '',   -- SHA-256(challengeId:otp:pepper); cleared after use
  expires_at  BIGINT      NOT NULL,              -- Unix timestamp in milliseconds
  attempts    INTEGER     NOT NULL DEFAULT 0,
  used        BOOLEAN     NOT NULL DEFAULT false,
  user_exists BOOLEAN     NOT NULL DEFAULT true,
  user_id     UUID,                              -- Supabase Auth user id (nullable)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup and cleanup of expired rows
CREATE INDEX IF NOT EXISTS idx_prot_expires ON public.password_reset_otps (expires_at);
CREATE INDEX IF NOT EXISTS idx_prot_email   ON public.password_reset_otps (email);

-- Enable RLS — only the service-role key (used by the Edge Function) can read/write
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- Deny all access to anon / authenticated roles (service role bypasses RLS automatically)
DROP POLICY IF EXISTS "deny_all" ON public.password_reset_otps;
CREATE POLICY "deny_all" ON public.password_reset_otps
  AS RESTRICTIVE
  FOR ALL
  USING (false);

-- Optional: auto-delete rows older than 30 minutes (keeps table clean)
-- Uncomment and run separately if pg_cron is enabled on your Supabase project:
-- SELECT cron.schedule(
--   'cleanup-otp-challenges',
--   '*/15 * * * *',
--   $$DELETE FROM public.password_reset_otps WHERE expires_at < (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT$$
-- );
