-- ============================================================
--  SSA Supabase RLS Security Fix
--  Run in: Supabase Dashboard → SQL Editor → New query → Run
--
--  What this fixes:
--    1. Products & Inventory: only authenticated admin can write/edit/delete
--    2. Customers: only authenticated users can update their OWN record
--    3. Orders anon read: locked — anon users can no longer bulk-read all orders
--    4. Settings: only authenticated admin can write/edit/delete
-- ============================================================


-- ================================================================
--  1. PRODUCTS — restrict write/update/delete to admin users only
-- ================================================================
drop policy if exists products_admin_write  on public.products;
drop policy if exists products_admin_update on public.products;
drop policy if exists products_admin_delete on public.products;

create policy products_admin_write on public.products
  for insert to authenticated
  with check (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy products_admin_update on public.products
  for update to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy products_admin_delete on public.products
  for delete to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );


-- ================================================================
--  2. INVENTORY — restrict write/update/delete to admin users only
-- ================================================================
drop policy if exists inventory_admin_write  on public.inventory;
drop policy if exists inventory_admin_update on public.inventory;
drop policy if exists inventory_admin_delete on public.inventory;

create policy inventory_admin_write on public.inventory
  for insert to authenticated
  with check (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy inventory_admin_update on public.inventory
  for update to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy inventory_admin_delete on public.inventory
  for delete to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );


-- ================================================================
--  3. ORDERS — remove anon read-all; authenticated users see own orders only
--
--  NOTE: This means customers using localStorage-only login (no Supabase
--  session) will NOT be able to load order history from Supabase directly.
--  They will fall back to localStorage order history (which still works).
--  Customers who sign in via Supabase Auth will continue to see their orders.
-- ================================================================
drop policy if exists orders_select_anon on public.orders;

-- Keep orders_select_own (authenticated users see only their own orders — already correct)
-- Keep orders_admin_all  (admin sees and manages all orders — already correct)
-- Keep orders_insert_public (anyone can place an order — needed for checkout)


-- ================================================================
--  4. CUSTOMERS — only allow update on own record (authenticated)
-- ================================================================
drop policy if exists customers_update_public on public.customers;

-- Authenticated users (with Supabase JWT) can update their own record
create policy customers_update_own on public.customers
  for update to authenticated
  using  (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

-- Admin can update any customer record
create policy customers_admin_update on public.customers
  for update to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );


-- ================================================================
--  5. SETTINGS — restrict write/update/delete to admin users only
--     (settings stores Power Automate webhooks — must be protected)
-- ================================================================
drop policy if exists settings_public_write  on public.settings;
drop policy if exists settings_public_update on public.settings;
drop policy if exists settings_public_delete on public.settings;
drop policy if exists settings_admin_write   on public.settings;

create policy settings_admin_write on public.settings
  for insert to authenticated
  with check (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy settings_admin_update on public.settings
  for update to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy settings_admin_delete on public.settings
  for delete to authenticated
  using (
    exists (
      select 1 from public.admin_users a
      where lower(a.email) = lower(auth.jwt() ->> 'email')
    )
  );


-- ================================================================
--  Verify: list all current policies (for manual review)
-- ================================================================
select
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
