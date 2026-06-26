-- =========================================
-- FIX: Tambah kolom brand & category ke tabel products
-- Jalankan di Supabase SQL Editor
-- =========================================

alter table public.products
  add column if not exists category text default 'Makanan',
  add column if not exists brand text default '';
