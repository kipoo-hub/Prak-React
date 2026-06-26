-- =========================================
-- PROMOTE USER TO ADMIN
-- Ganti email di bawah dengan email yang Anda gunakan untuk login
-- =========================================

-- Cari user di auth.users berdasarkan email, lalu update role di profiles
update public.profiles
set role = 'admin',
    updated_at = now()
where id = (
  select id from auth.users
  where email = 'taufiq@gmail.com'
);

-- Verifikasi hasil
select p.id, p.full_name, p.role, u.email
from public.profiles p
join auth.users u on u.id = p.id
where p.id = (
  select id from auth.users
  where email = 'taufiq@gmail.com'
);
