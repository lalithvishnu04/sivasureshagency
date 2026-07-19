-- SSA Migration: Add missing columns to orders table
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste & run
--
-- These columns are needed for:
--   estimatedDelivery  → Admin sets delivery date, user sees it on their order
--   rating             → Customer star rating (1-5)
--   ratingComment      → Customer review text
--   rating_at          → Timestamp when rating was submitted
--   ratingImage        → (reserved for future use, stored in localStorage only)

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "estimatedDelivery" text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "rating" integer;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "ratingComment" text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "rating_at" text;
