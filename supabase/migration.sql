-- ================================================================
-- MIGRATION: Auth + RBAC + CRUD + Loyalty System (Poin & Tier)
-- Jalankan file ini di Supabase SQL Editor secara berurutan
-- ================================================================

-- =========================================
-- 1. MEMBER_TIERS (master data tier)
-- =========================================
create table if not exists public.member_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  min_points integer not null default 0,
  discount_percent numeric(5,2) not null default 0,
  created_at timestamptz not null default now()
);

-- =========================================
-- 2. PROFILES (extends auth.users)
-- =========================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null default 'member' check (role in ('admin','member')),
  tier_id uuid references public.member_tiers(id),
  total_points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================
-- 3. CUSTOMERS
-- =========================================
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  phone text,
  email text,
  address text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================
-- 4. PRODUCTS
-- =========================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique,
  category text default 'Makanan',
  brand text default '',
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================
-- 5. ORDERS
-- =========================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.customers(id),
  status text not null default 'pending' check (status in ('pending','paid','completed','cancelled')),
  total_amount numeric(12,2) not null default 0,
  points_earned integer not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================
-- 6. ORDER_ITEMS
-- =========================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  unit_price numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(12,2) not null,
  created_at timestamptz not null default now()
);

-- =========================================
-- 7. POINT_TRANSACTIONS
-- =========================================
create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id),
  points integer not null,
  type text not null check (type in ('earn','redeem','adjustment')),
  description text,
  created_at timestamptz not null default now()
);

-- =========================================
-- TRIGGER & FUNCTION
-- =========================================

-- A. Auto-create profile saat user register
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'member');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- B. Update total_points & tier setiap ada point_transaction baru
create or replace function public.apply_point_transaction()
returns trigger as $$
declare
  v_new_total integer;
  v_new_tier uuid;
begin
  update public.profiles
    set total_points = total_points + new.points,
        updated_at = now()
    where id = new.profile_id
    returning total_points into v_new_total;

  select id into v_new_tier
    from public.member_tiers
    where min_points <= v_new_total
    order by min_points desc
    limit 1;

  update public.profiles set tier_id = v_new_tier where id = new.profile_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_apply_point_transaction on public.point_transactions;
create trigger trg_apply_point_transaction
  after insert on public.point_transactions
  for each row execute function public.apply_point_transaction();

-- =========================================
-- SEED DATA: MEMBER TIERS
-- =========================================
insert into public.member_tiers (name, min_points, discount_percent) values
('Bronze', 0, 0),
('Silver', 500, 5),
('Gold', 1500, 10)
on conflict (name) do nothing;

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

-- Helper function: cek role admin (security definer agar tidak kena RLS loop)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ---- PROFILES ----
alter table public.profiles enable row level security;

create policy "admin_select_all_profiles" on public.profiles
  for select using (public.is_admin());

create policy "self_select_profile" on public.profiles
  for select using (id = auth.uid());

create policy "self_update_profile" on public.profiles
  for update using (id = auth.uid());

create policy "admin_update_any_profile" on public.profiles
  for update using (public.is_admin());

-- ---- MEMBER_TIERS ----
alter table public.member_tiers enable row level security;

create policy "authenticated_select_tiers" on public.member_tiers
  for select using (auth.role() = 'authenticated');

create policy "admin_manage_tiers" on public.member_tiers
  for all using (public.is_admin());

-- ---- CUSTOMERS ----
alter table public.customers enable row level security;

create policy "admin_all_customers" on public.customers
  for all using (public.is_admin());

create policy "member_select_own_customer" on public.customers
  for select using (profile_id = auth.uid());

-- ---- PRODUCTS ----
alter table public.products enable row level security;

create policy "authenticated_select_active_products" on public.products
  for select using (auth.role() = 'authenticated' and is_active = true);

create policy "admin_manage_products" on public.products
  for all using (public.is_admin());

-- ---- ORDERS ----
alter table public.orders enable row level security;

create policy "admin_all_orders" on public.orders
  for all using (public.is_admin());

create policy "member_select_own_orders" on public.orders
  for select using (
    customer_id in (
      select id from public.customers where profile_id = auth.uid()
    )
  );

create policy "member_insert_own_orders" on public.orders
  for insert with check (
    customer_id in (
      select id from public.customers where profile_id = auth.uid()
    )
  );

-- ---- ORDER_ITEMS ----
alter table public.order_items enable row level security;

create policy "admin_all_order_items" on public.order_items
  for all using (public.is_admin());

create policy "member_select_own_order_items" on public.order_items
  for select using (
    order_id in (
      select o.id from public.orders o
      join public.customers c on c.id = o.customer_id
      where c.profile_id = auth.uid()
    )
  );

create policy "member_insert_own_order_items" on public.order_items
  for insert with check (
    order_id in (
      select o.id from public.orders o
      join public.customers c on c.id = o.customer_id
      where c.profile_id = auth.uid()
    )
  );

-- ---- POINT_TRANSACTIONS ----
alter table public.point_transactions enable row level security;

create policy "admin_all_point_transactions" on public.point_transactions
  for all using (public.is_admin());

create policy "member_select_own_points" on public.point_transactions
  for select using (profile_id = auth.uid());

-- =========================================
-- END MIGRATION
-- =========================================
