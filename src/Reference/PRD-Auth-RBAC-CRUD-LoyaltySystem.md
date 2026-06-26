# Product Requirement Document (PRD)
## Fitur: Autentikasi, Role Management, CRUD, Riwayat Pesanan, Sistem Poin & Tier

**Versi:** 1.0
**Stack:** React JS + Supabase (Postgres + Auth + RLS) + Tailwind CSS + shadcn/ui

---

## 1. Latar Belakang & Tujuan

Proyek sudah memiliki halaman UI untuk **dashboard, customer, produk**, tetapi belum punya:
- Halaman **login** dan **register** (belum dibuat sama sekali, harus dibangun dari nol)
- Skema database
- Autentikasi nyata
- CRUD yang terhubung ke database
- Role-based access control
- Sistem poin & tier member

Tujuan PRD ini adalah memberi spesifikasi yang cukup detail agar AI coding agent bisa mengimplementasikan fitur **tanpa menebak-nebak desain database atau aturan akses**, dan **tanpa mengubah UI/halaman yang tidak terkait**.

### Prinsip Implementasi
1. Solusi paling sederhana yang memenuhi requirement (hindari over-engineering, hindari microservice/queue/cache layer dsb).
2. Ikuti pola folder & komponen yang sudah ada di repo (jangan buat struktur folder baru kecuali perlu).
3. Tidak boleh mengubah halaman yang tidak berkaitan dengan fitur ini.
4. Tidak boleh mengubah desain UI existing kecuali untuk menyambungkan ke data (misalnya mengganti data dummy dengan data Supabase) — bukan mengubah tampilan/layout.

---

## 2. Role & Akses (Ringkasan)

| Role | Deskripsi | Akses |
|---|---|---|
| **guest** | Belum login | Hanya bisa lihat halaman publik (landing, login, register). Tidak bisa akses dashboard. |
| **member** | User terdaftar biasa (customer) | Lihat & buat pesanan sendiri, lihat riwayat pesanan sendiri, lihat poin & tier sendiri, edit profil sendiri. |
| **admin** | Pengelola toko/klinik | Full CRUD ke customer, produk, pesanan, semua data member. Bisa atur tier & rule poin. |

> Role disimpan di tabel `profiles`, bukan di JWT custom claim, supaya sederhana dan mudah diubah lewat dashboard admin. RLS membaca role dari tabel `profiles` via subquery.

---

## 3. Desain Database

### 3.1 Daftar Tabel

1. `profiles` — data tambahan user (role, nama, tier, total poin)
2. `customers` — data customer (bisa terhubung ke `profiles` jika customer adalah user terdaftar, atau berdiri sendiri jika input manual oleh admin)
3. `products` — data produk/jasa
4. `orders` — header pesanan
5. `order_items` — detail item per pesanan
6. `member_tiers` — master data tier (Bronze, Silver, Gold, dst) beserta syarat & benefit
7. `point_transactions` — histori penambahan/pengurangan poin

### 3.2 Skema Detail (DDL)

```sql
-- =========================================
-- 1. PROFILES (extends auth.users)
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null default 'member' check (role in ('admin','member')),
  tier_id uuid references public.member_tiers(id),
  total_points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Data tambahan user, dibuat otomatis via trigger saat register';

-- =========================================
-- 2. MEMBER_TIERS
-- =========================================
create table public.member_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,             -- Bronze, Silver, Gold
  min_points integer not null default 0, -- syarat minimum poin untuk masuk tier ini
  discount_percent numeric(5,2) not null default 0, -- benefit contoh: diskon %
  created_at timestamptz not null default now()
);

-- =========================================
-- 3. CUSTOMERS
-- =========================================
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null, -- null jika input manual admin
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
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique,
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
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,       -- generate di app/trigger, misal INV-20260626-0001
  customer_id uuid not null references public.customers(id),
  status text not null default 'pending' check (status in ('pending','paid','completed','cancelled')),
  total_amount numeric(12,2) not null default 0,
  points_earned integer not null default 0,
  created_by uuid references public.profiles(id), -- admin/member yg membuat order
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================
-- 6. ORDER_ITEMS
-- =========================================
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,    -- snapshot nama produk saat transaksi
  unit_price numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(12,2) not null,
  created_at timestamptz not null default now()
);

-- =========================================
-- 7. POINT_TRANSACTIONS
-- =========================================
create table public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id),
  points integer not null,              -- positif = earn, negatif = redeem/adjust
  type text not null check (type in ('earn','redeem','adjustment')),
  description text,
  created_at timestamptz not null default now()
);
```

### 3.3 Relasi Antar Tabel (ERD Naratif)

```
auth.users (1) ───── (1) profiles
profiles   (1) ───── (0..1) customers        [profile_id, jika customer adalah member]
profiles   (N) ───── (1) member_tiers        [tier_id]
profiles   (1) ───── (N) point_transactions
customers  (1) ───── (N) orders
orders     (1) ───── (N) order_items
products   (1) ───── (N) order_items
orders     (1) ───── (N) point_transactions  [opsional, untuk tracking sumber poin]
```

**Penjelasan relasi penting:**
- Satu **customer** bisa punya banyak **orders** (1-to-many).
- Satu **order** bisa punya banyak **order_items**, satu **order_item** hanya merujuk satu **product** (many-to-many antara orders & products, dijembatani oleh order_items).
- **profiles.tier_id** menunjuk ke tier saat ini — dihitung ulang otomatis berdasarkan `total_points` (lihat section 3.4).
- **point_transactions** adalah log/histori; `profiles.total_points` adalah hasil agregat (cached) supaya query cepat tanpa SUM tiap saat.

### 3.4 Trigger & Function Penting (Business Logic Sederhana)

```sql
-- A. Auto-create profile saat user register
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'member');
  return new;
end;
$$ language plpgsql security definer;

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

create trigger trg_apply_point_transaction
  after insert on public.point_transactions
  for each row execute function public.apply_point_transaction();
```

> Catatan: Logika "berapa poin yang didapat per order" (misal 1 poin per Rp10.000) sebaiknya dihitung di aplikasi (frontend/server function) saat order berstatus `completed`, lalu insert ke `point_transactions`. Ini lebih sederhana daripada trigger kompleks di order, dan memudahkan jika rule poin berubah nanti.

---

## 4. Row Level Security (RLS)

Semua tabel **wajib** `enable row level security`. Berikut policy per tabel.

### 4.1 Helper Function (cek role tanpa recursive RLS issue)

```sql
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;
```
> Pakai `security definer` agar function ini bisa membaca tabel `profiles` tanpa terjebak RLS dirinya sendiri (penyebab umum RLS "tidak return data").

### 4.2 PROFILES

```sql
alter table public.profiles enable row level security;

-- Admin bisa lihat semua profile
create policy "admin_select_all_profiles" on public.profiles
  for select using (public.is_admin());

-- User bisa lihat profile sendiri
create policy "self_select_profile" on public.profiles
  for select using (id = auth.uid());

-- User bisa update profile sendiri (kecuali kolom role/tier/points - dibatasi di app layer/trigger)
create policy "self_update_profile" on public.profiles
  for update using (id = auth.uid());

-- Hanya admin yang bisa update role orang lain
create policy "admin_update_any_profile" on public.profiles
  for update using (public.is_admin());
```

### 4.3 MEMBER_TIERS

```sql
alter table public.member_tiers enable row level security;

-- Semua user login bisa lihat daftar tier (untuk tampil di dashboard)
create policy "authenticated_select_tiers" on public.member_tiers
  for select using (auth.role() = 'authenticated');

-- Hanya admin yang bisa kelola tier
create policy "admin_manage_tiers" on public.member_tiers
  for all using (public.is_admin());
```

### 4.4 CUSTOMERS

```sql
alter table public.customers enable row level security;

-- Admin full access
create policy "admin_all_customers" on public.customers
  for all using (public.is_admin());

-- Member hanya bisa lihat data customer miliknya sendiri (jika ada profile_id terkait)
create policy "member_select_own_customer" on public.customers
  for select using (profile_id = auth.uid());
```

### 4.5 PRODUCTS

```sql
alter table public.products enable row level security;

-- Semua user login bisa lihat produk aktif (untuk member memilih saat order)
create policy "authenticated_select_active_products" on public.products
  for select using (auth.role() = 'authenticated' and is_active = true);

-- Hanya admin yang bisa CRUD produk
create policy "admin_manage_products" on public.products
  for all using (public.is_admin());
```

### 4.6 ORDERS

```sql
alter table public.orders enable row level security;

-- Admin full access
create policy "admin_all_orders" on public.orders
  for all using (public.is_admin());

-- Member hanya bisa lihat order miliknya sendiri (via customers.profile_id)
create policy "member_select_own_orders" on public.orders
  for select using (
    customer_id in (
      select id from public.customers where profile_id = auth.uid()
    )
  );

-- Member boleh membuat order untuk dirinya sendiri
create policy "member_insert_own_orders" on public.orders
  for insert with check (
    customer_id in (
      select id from public.customers where profile_id = auth.uid()
    )
  );
```

### 4.7 ORDER_ITEMS

```sql
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
```

### 4.8 POINT_TRANSACTIONS

```sql
alter table public.point_transactions enable row level security;

create policy "admin_all_point_transactions" on public.point_transactions
  for all using (public.is_admin());

create policy "member_select_own_points" on public.point_transactions
  for select using (profile_id = auth.uid());

-- Insert poin hanya dilakukan via server-side/admin (bukan langsung dari client member)
-- sehingga tidak ada policy insert untuk member.
```

> **Penting:** Karena policy `insert` untuk `point_transactions` tidak diberikan ke member, penambahan poin harus dilakukan lewat aksi yang dijalankan dengan role admin/service (misalnya admin menandai order `completed`, lalu sistem insert point_transaction menggunakan akun admin yang sedang login, atau lewat Supabase Edge Function dengan service role jika ingin lebih aman).

---

## 5. Spesifikasi Fitur (User Stories + Acceptance Criteria)

### 5.1 Autentikasi (Login/Register)

> **Catatan penting**: Halaman login & register **belum ada sama sekali** di proyek ini dan harus **dibuat baru dari nol**. Gunakan komponen shadcn/ui (Card, Input, Button, Form, Label) dan style Tailwind yang konsisten dengan halaman lain yang sudah ada (dashboard/customer/produk) — samakan warna, font, spacing, dan layout container agar terasa satu kesatuan desain, bukan menambah library/desain baru.

- **US-00 (Baru)**: Sebagai guest, saya melihat halaman **Login** (`/login`) berisi form email & password, link ke halaman register, dan tombol submit.
  - AC: Halaman dibuat sebagai komponen/page baru, mengikuti struktur folder routing yang sudah dipakai di proyek (misal di folder `pages`/`routes` yang sama dengan dashboard).
  - AC: Validasi input dasar (email format, password tidak kosong) sebelum submit.
  - AC: Tampilkan error message dari Supabase (misal "Invalid login credentials") dengan komponen toast/alert dari shadcn/ui.
- **US-00b (Baru)**: Sebagai guest, saya melihat halaman **Register** (`/register`) berisi form nama lengkap, email, password, konfirmasi password, dan link ke halaman login.
  - AC: Halaman dibuat baru, layout & komponen konsisten dengan halaman login.
  - AC: Validasi: password & konfirmasi password harus sama, password minimal 6 karakter.
- **US-01**: Sebagai guest, saya bisa register dengan email & password → otomatis dibuatkan `profiles` dengan role `member`.
  - AC: Setelah register, trigger `handle_new_user` membuat row di `profiles`.
  - AC: Redirect ke halaman dashboard member setelah register berhasil.
- **US-02**: Sebagai user, saya bisa login dan diarahkan ke dashboard sesuai role saya (admin → dashboard admin, member → dashboard member).
  - AC: Gunakan `supabase.auth.signInWithPassword`.
  - AC: Setelah login, ambil role dari `profiles`, lalu redirect (jangan ubah komponen dashboard yang sudah ada, cukup tambahkan logic redirect/guard).
- **US-03**: Sebagai guest, saya tidak bisa mengakses route `/dashboard/*` (protected route), dan otomatis diarahkan ke halaman `/login` yang baru dibuat.
  - AC: Implementasikan route guard sederhana (HOC/wrapper component) memeriksa session Supabase.

### 5.2 Role Management
- **US-04**: Sebagai admin, saya bisa mengubah role user lain (member ↔ admin) dari halaman admin.
  - AC: Hanya admin yang bisa akses fitur ini (RLS `admin_update_any_profile`).

### 5.3 CRUD Customer, Produk, Pesanan
- **US-05**: Admin bisa Create/Read/Update/Delete data customer, produk, dan pesanan — sambungkan ke halaman yang sudah ada (ganti dummy data dengan Supabase query), tanpa mengubah layout.
- **US-06**: Member hanya bisa melihat & membuat pesanan untuk dirinya sendiri (tidak bisa CRUD customer/produk).

### 5.4 Dashboard Member
- **US-07**: Member melihat ringkasan: total poin, tier saat ini, jumlah pesanan, pesanan terakhir — di halaman dashboard yang sudah ada (hanya ganti sumber data).

### 5.5 Riwayat Pesanan
- **US-08**: Member & admin bisa melihat daftar pesanan beserta status & detail item, difilter sesuai akses RLS masing-masing.

### 5.6 Sistem Poin & Tier
- **US-09**: Saat admin mengubah status order menjadi `completed`, sistem menghitung poin (misal 1 poin/Rp10.000) dan insert ke `point_transactions` → trigger otomatis update `total_points` & `tier_id` di profile member terkait.
- **US-10**: Admin bisa CRUD master data tier (`member_tiers`): nama, syarat minimum poin, persen diskon.

---

## 6. Rencana Implementasi Bertahap

> Setiap tahap harus selesai & ditest sebelum lanjut ke tahap berikutnya. Tidak boleh mengubah halaman/file di luar scope tahap tersebut.

### Tahap 1 — Setup Database
1. Jalankan semua DDL (tabel) di section 3.2 lewat Supabase SQL editor / migration.
2. Jalankan trigger & function di section 3.4.
3. Insert seed data minimal untuk `member_tiers` (contoh: Bronze 0pt, Silver 500pt, Gold 1500pt).
4. Aktifkan RLS & jalankan semua policy di section 4.

### Tahap 2 — Autentikasi
1. **Buat halaman baru `/login`** (form email, password, link ke register, tombol submit) menggunakan komponen shadcn/ui & style Tailwind yang konsisten dengan halaman existing.
2. **Buat halaman baru `/register`** (form nama, email, password, konfirmasi password, link ke login) dengan layout konsisten dengan halaman login.
3. Hubungkan kedua halaman baru tersebut ke Supabase Auth (`signInWithPassword`, `signUp`).
4. Buat helper/hook `useAuth()` atau `useSession()` (sesuai pola state management yang sudah dipakai di repo) untuk menyimpan session & profile (termasuk role) secara global.
5. Buat route guard: redirect ke `/login` jika belum login saat akses `/dashboard/*`.
6. Buat role-based redirect setelah login (admin vs member), tanpa mengubah komponen dashboard itu sendiri.

### Tahap 3 — CRUD Produk & Customer
1. Sambungkan halaman **produk** (list/create/edit/delete) ke tabel `products` via Supabase client.
2. Sambungkan halaman **customer** (list/create/edit/delete) ke tabel `customers`.
3. Pastikan UI tetap sama, hanya layer data yang berubah dari dummy → Supabase.

### Tahap 4 — CRUD Pesanan & Riwayat Pesanan
1. Buat halaman/komponen create order (pilih customer, pilih produk, qty → hitung subtotal & total) → insert ke `orders` + `order_items`.
2. Buat halaman riwayat pesanan (list `orders` dengan filter sesuai role, detail per order menampilkan `order_items`).
3. Tambahkan aksi admin untuk update status order (pending → paid → completed → cancelled).

### Tahap 5 — Sistem Poin & Tier
1. Saat admin set status order = `completed`, jalankan logic hitung poin & insert ke `point_transactions`.
2. Tampilkan total poin & tier di dashboard member (read dari `profiles` & `member_tiers`).
3. Buat halaman admin sederhana untuk CRUD `member_tiers`.

### Tahap 6 — Role Management (Admin)
1. Tambahkan fitur di halaman admin untuk mengubah role user (member ↔ admin).
2. Testing akhir: pastikan guest tidak bisa akses dashboard, member tidak bisa CRUD customer/produk, admin full access.

---

## 7. Out of Scope (Tidak termasuk PRD ini)
- Payment gateway / pembayaran online.
- Notifikasi email/WhatsApp otomatis.
- Multi-cabang/multi-lokasi klinik.
- Export laporan (PDF/Excel) — bisa jadi PRD terpisah.

---

## 8. Catatan untuk AI Coding Agent
- Gunakan Supabase client yang **sudah terkonfigurasi di repo** (jangan buat instance client baru jika sudah ada).
- Ikuti pola fetching data (misalnya React Query/SWR/custom hook) yang sudah dipakai di halaman dashboard/customer/produk saat ini.
- Gunakan komponen shadcn/ui yang sudah ada (table, dialog, form, toast) — jangan install library tambahan kecuali benar-benar diperlukan.
- Jika menemukan konflik antara PRD ini dan struktur kode yang sudah ada, **prioritaskan konsistensi dengan kode existing**, lalu laporkan konflik tersebut sebagai catatan/komentar di PR.
