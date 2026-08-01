-- ============================================================
--  SSA RLS Fix #2 — Drop products_update_rating_anon
--
--  PROBLEM: This policy allows ANYONE (anon) to UPDATE any
--  product row with no restrictions — including changing price,
--  name, category, etc. This is a critical data integrity risk.
--
--  FIX: Drop the policy. Product ratings submitted by customers
--  without a Supabase session will continue working via
--  localStorage. Authenticated customers (Supabase session)
--  are covered by products_admin_update for admins. Customers
--  who need to submit ratings will need a lighter approach:
--  either a separate ratings table, or the localStorage-only
--  path (which the app already falls back to).
--
--  Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

drop policy if exists products_update_rating_anon on public.products;

-- Verify the policy is gone
select policyname, cmd, qual
from pg_policies
where tablename = 'products'
order by policyname;
