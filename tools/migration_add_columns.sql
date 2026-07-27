-- Migration: Add missing columns to customers and messages tables
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/kyzlxhncnqahlpfhtoky/sql

-- ── customers table: add customerId column ───────────────────────
alter table public.customers add column if not exists "customerId" text;

-- ── messages table: add all columns used by the app ─────────────
alter table public.messages add column if not exists "ticketId" text;
alter table public.messages add column if not exists "status" text not null default 'Open';
alter table public.messages add column if not exists "source" text not null default 'contact-form';
alter table public.messages add column if not exists "customerId" text;
alter table public.messages add column if not exists "customerName" text;
alter table public.messages add column if not exists "attachmentUrls" jsonb;
alter table public.messages add column if not exists "updatedAt" timestamptz default now();
alter table public.messages add column if not exists "chatMessages" jsonb;
alter table public.messages add column if not exists "sessionId" text;
alter table public.messages add column if not exists "adminNote" text;

-- Index for faster ticket lookups
create index if not exists idx_messages_ticket_id on public.messages("ticketId");
create index if not exists idx_messages_status on public.messages(status);
create index if not exists idx_messages_source on public.messages(source);
create index if not exists idx_customers_customer_id on public.customers("customerId");
