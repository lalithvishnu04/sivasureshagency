-- ============================================================
--  SSA Security & Performance Migration — v174
--  Run in: Supabase Dashboard → SQL Editor → New query → Run
--
--  Fixes:
--    1. Settings table — block anon read of webhook URLs
--    2. Admin users table — block anon read (hides admin emails)
--    3. Messages table — block anon select (contact form messages)
--    4. Orders — add composite index for email+status queries
--    5. Products — add index on isActive flag
--    6. Orders total — add CHECK constraint to reject negative totals
--    7. OTP table cleanup — schedule auto-purge of expired rows
-- ============================================================

-- ================================================================
--  1. SETTINGS — remove anon read access
--     The settings table stores Power Automate webhook URLs.
--     These URLs can trigger email sends — must not be public.
-- ================================================================
drop policy if exists settings_public_read on public.settings;

-- Admin-only read
drop policy if exists settings_admin_read on public.settings;
create policy settings_admin_read on public.settings
  for select to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Edge Functions read settings via service role key (bypasses RLS) — no policy needed


-- ================================================================
--  2. ADMIN USERS — block anon read of the admin email list
-- ================================================================
drop policy if exists admin_users_self_read   on public.admin_users;
drop policy if exists admin_users_anon_read   on public.admin_users;
drop policy if exists admin_users_public_read on public.admin_users;

-- Only authenticated admins can read the admin_users table
create policy admin_users_admin_read on public.admin_users
  for select to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );


-- ================================================================
--  3. MESSAGES — block anon select (contact form submissions)
--     Anon users can INSERT (send a contact form); admin reads them.
--     The original policy allowed anyone to SELECT all messages.
-- ================================================================
drop policy if exists messages_public_read on public.messages;
-- messages_admin_read_write already covers admin; only anon insert is kept


-- ================================================================
--  4. ORDERS — composite index for common admin filter queries
-- ================================================================
create index if not exists idx_orders_email_status
  on public.orders ("customerEmail", status);

create index if not exists idx_orders_status_created
  on public.orders (status, "createdAt" desc);

create index if not exists idx_orders_payment_status
  on public.orders ("paymentStatus");


-- ================================================================
--  5. PRODUCTS — index on soft-delete + isActive flag
-- ================================================================
create index if not exists idx_products_active
  on public.products ("isActive")
  where "isActive" = true;


-- ================================================================
--  6. ORDERS — reject negative or zero-paise totals at DB level
-- ================================================================
alter table public.orders
  drop constraint if exists orders_total_positive;

alter table public.orders
  add constraint orders_total_positive check (total >= 0);


-- ================================================================
--  7. OTP TABLE — auto-purge expired rows (keeps table lean)
--     Requires pg_cron extension (available on Supabase Pro+).
--     Skip if on free tier — rows expire naturally via RLS.
-- ================================================================
-- Uncomment only if pg_cron is enabled on your project:
-- SELECT cron.schedule(
--   'cleanup-otp-expired',
--   '*/30 * * * *',
--   $$DELETE FROM public.password_reset_otps
--     WHERE expires_at < (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
--        OR used = true$$
-- );


-- ================================================================
--  Verify policies (review in dashboard)
-- ================================================================
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('settings','admin_users','messages','orders')
order by tablename, policyname;
