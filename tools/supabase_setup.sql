-- Supabase schema + policies for Siva Suresh Agency
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key default ('p_' || replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  category text not null,
  price numeric not null default 0,
  "oldPrice" numeric,
  gender text,
  sleeve text,
  sizes text[] not null default '{}',
  description text,
  image text,
  "colorVariants" jsonb not null default '[]'::jsonb,
  "mainImage" text,
  badge text,
  "fitSizing" text,
  "fabricCare" text,
  "returns" text,
  "totalStock" integer default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- Backward-compatible migration for existing projects.
alter table public.products add column if not exists "colorVariants" jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists "mainImage" text;
alter table public.products add column if not exists "fitSizing" text;
alter table public.products add column if not exists "fabricCare" text;
alter table public.products add column if not exists "returns" text;

create table if not exists public.inventory (
  id text primary key default ('i_' || replace(gen_random_uuid()::text, '-', '')),
  "productName" text not null,
  "productCategory" text,
  size text not null,
  color text,
  quantity integer not null default 0,
  status text not null default 'in_stock',
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key default ('o_' || replace(gen_random_uuid()::text, '-', '')),
  "orderId" text unique,
  "customerName" text,
  "customerEmail" text not null,
  "customerPhone" text,
  address text,
  city text,
  pincode text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  payment text,
  status text not null default 'Processing',
  "trackingId" text default '',
  "inventoryDeducted" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.customers (
  id text primary key,
  name text,
  "firstName" text,
  "lastName" text,
  email text unique not null,
  phone text,
  "orderCount" integer not null default 0,
  "totalSpent" numeric not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.messages (
  id text primary key default ('m_' || replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  read boolean not null default false,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.settings (
  id text primary key,
  name text,
  suffix text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
alter table public.settings add column if not exists "createdAt" timestamptz not null default now();

create index if not exists idx_orders_customer_email on public.orders("customerEmail");
create index if not exists idx_orders_created_at on public.orders("createdAt" desc);
create index if not exists idx_inventory_product_size on public.inventory("productName", size);
create index if not exists idx_products_category on public.products(category);

alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.customers enable row level security;
alter table public.messages enable row level security;
alter table public.admin_users enable row level security;
alter table public.settings enable row level security;

-- Drop policies if they exist (PostgreSQL doesn't support IF NOT EXISTS for policies)
drop policy if exists products_public_read on public.products;
drop policy if exists products_admin_write on public.products;
drop policy if exists products_admin_update on public.products;
drop policy if exists products_admin_delete on public.products;
drop policy if exists inventory_public_read on public.inventory;
drop policy if exists inventory_admin_write on public.inventory;
drop policy if exists inventory_admin_update on public.inventory;
drop policy if exists inventory_admin_delete on public.inventory;
drop policy if exists orders_insert_public on public.orders;
drop policy if exists orders_select_own on public.orders;
drop policy if exists orders_admin_all on public.orders;
drop policy if exists customers_insert_public on public.customers;
drop policy if exists customers_update_public on public.customers;
drop policy if exists customers_select_admin on public.customers;
drop policy if exists messages_insert_public on public.messages;
drop policy if exists messages_admin_read_write on public.messages;
drop policy if exists admin_users_self_read on public.admin_users;
drop policy if exists settings_public_read on public.settings;
drop policy if exists settings_admin_write on public.settings;
drop policy if exists settings_public_write on public.settings;
drop policy if exists settings_public_update on public.settings;
drop policy if exists settings_public_delete on public.settings;
drop policy if exists assets_public_read on storage.objects;
drop policy if exists assets_admin_write on storage.objects;

-- Create policies
create policy products_public_read on public.products
  for select using (true);
create policy products_admin_write on public.products
  for insert with check (true);
create policy products_admin_update on public.products
  for update using (true) with check (true);
create policy products_admin_delete on public.products
  for delete using (true);

create policy inventory_public_read on public.inventory
  for select using (true);
create policy inventory_admin_write on public.inventory
  for insert with check (true);
create policy inventory_admin_update on public.inventory
  for update using (true) with check (true);
create policy inventory_admin_delete on public.inventory
  for delete using (true);

create policy orders_insert_public on public.orders
  for insert to anon, authenticated with check (true);
create policy orders_select_own on public.orders
  for select to authenticated
  using (lower("customerEmail") = lower(auth.jwt() ->> 'email'));
create policy orders_admin_all on public.orders
  for all to authenticated
  using (exists (select 1 from public.admin_users a where lower(a.email) = lower(auth.jwt() ->> 'email')))
  with check (exists (select 1 from public.admin_users a where lower(a.email) = lower(auth.jwt() ->> 'email')));

create policy customers_insert_public on public.customers
  for insert to anon, authenticated with check (true);
create policy customers_update_public on public.customers
  for update to anon, authenticated using (true) with check (true);
create policy customers_select_admin on public.customers
  for select to authenticated
  using (exists (select 1 from public.admin_users a where lower(a.email) = lower(auth.jwt() ->> 'email')));

create policy messages_insert_public on public.messages
  for insert to anon, authenticated with check (true);
create policy messages_admin_read_write on public.messages
  for all to authenticated
  using (exists (select 1 from public.admin_users a where lower(a.email) = lower(auth.jwt() ->> 'email')))
  with check (exists (select 1 from public.admin_users a where lower(a.email) = lower(auth.jwt() ->> 'email')));

create policy admin_users_self_read on public.admin_users
  for select to authenticated using (lower(email) = lower(auth.jwt() ->> 'email'));

create policy settings_public_read on public.settings
  for select using (true);
create policy settings_public_write on public.settings
  for insert with check (true);
create policy settings_public_update on public.settings
  for update using (true) with check (true);
create policy settings_public_delete on public.settings
  for delete using (true);

insert into public.admin_users(email)
values ('lalithvishnu04@gmail.com')
on conflict (email) do nothing;

insert into public.settings(id, name, suffix)
values ('scrubBrand', 'CliniFlex', '™')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

create policy assets_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'assets');
create policy assets_admin_write on storage.objects
  for all to authenticated
  using (
    bucket_id = 'assets'
    and exists (select 1 from public.admin_users a where lower(a.email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    bucket_id = 'assets'
    and exists (select 1 from public.admin_users a where lower(a.email) = lower(auth.jwt() ->> 'email'))
  );
