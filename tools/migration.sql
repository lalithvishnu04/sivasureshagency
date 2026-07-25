-- SSA Migration: Add missing columns to orders table
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste & run
--
-- These columns are needed for:
--   estimatedDelivery  → Admin sets delivery date, user sees it on their order
--   rating             → Customer star rating (1-5)
--   ratingComment      → Customer review text
--   rating_at          → Timestamp when rating was submitted
--   ratingImage        → (reserved for future use, stored in localStorage only)
--   statusHistory      → JSON map of status -> timestamp (for timeline dates)
--   returnRequest      → JSON object with return/exchange request details
--   deliveredAt        → Timestamp when order was delivered

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "estimatedDelivery" text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "rating" integer;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "ratingComment" text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "rating_at" text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "deliveredAt" text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "statusHistory" jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "returnRequest" jsonb DEFAULT NULL;

-- Products table: categoryNode not stored in DB (UI-only), but subCategory is needed
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "subCategory" text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "categoryNode" text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "subCategoryNode" text;
