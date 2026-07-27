-- SSA Migration: Support Ticket Tracking (comments, attachments, admin-created
-- tickets, chat requests, shared Power Automate webhook config, secure
-- ticket lookup by ID).
--
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste & run.
-- All statements are additive / idempotent (safe to run multiple times).

-- ── messages table: new columns ──────────────────────────────────────────
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "ticketId" text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "customerId" text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Open';
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "adminNote" text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "attachmentUrls" jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS comments jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS priority text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "sessionId" text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "convertedToTicket" text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS "updatedAt" timestamptz;

CREATE INDEX IF NOT EXISTS idx_messages_ticket_id ON public.messages("ticketId");
CREATE INDEX IF NOT EXISTS idx_messages_email ON public.messages(lower(email));

-- ── RLS: allow a logged-in customer to read their OWN tickets ───────────
-- (existing policies: messages_insert_public [anon+authenticated insert],
--  messages_admin_read_write [admin_users, full access]). This adds a
--  narrow, secure read policy scoped to the caller's own JWT email — it
--  does NOT expose other customers' tickets, unlike a blanket anon policy.
DROP POLICY IF EXISTS messages_select_own ON public.messages;
CREATE POLICY messages_select_own ON public.messages
  FOR SELECT TO authenticated
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

-- ── Secure guest "track by Ticket ID" lookup ─────────────────────────────
-- Ticket IDs are high-entropy (timestamp + random suffix), so this acts like
-- a capability URL. We deliberately do NOT grant a blanket anon SELECT on
-- the whole table (that would leak every customer's email/phone/messages to
-- anyone with the public anon key). Instead, a SECURITY DEFINER function
-- returns only display-safe fields for a single ticket, looked up by its
-- exact ID.
CREATE OR REPLACE FUNCTION public.get_ticket_by_id(p_ticket_id text)
RETURNS TABLE (
  "ticketId" text,
  name text,
  subject text,
  status text,
  message text,
  comments jsonb,
  "attachmentUrls" jsonb,
  "createdAt" timestamptz,
  "updatedAt" timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT "ticketId", name, subject, status, message, comments, "attachmentUrls", "createdAt", "updatedAt"
  FROM public.messages
  WHERE "ticketId" = p_ticket_id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_ticket_by_id(text) TO anon, authenticated;

-- ── Shared Power Automate webhook config (fixes: notifications never sent) ──
-- Previously stored in each browser's localStorage only, so only the admin's
-- own browser ever had the trigger URLs — every other visitor's requests
-- were silently dropped (confirmed 0 flow runs). Now stored centrally here;
-- js/ssa-comm.js reads/writes this row so every visitor shares the same
-- config, saved once from Admin -> Settings -> Communication Webhooks.
INSERT INTO public.settings(id, name)
VALUES ('commWebhooks', '{}')
ON CONFLICT (id) DO NOTHING;
