-- Ambassador self-service settings (editable at /admin/<city>).
-- Run in Supabase Dashboard → SQL Editor after 001_recaps.sql.

-- ── City Luma config ─────────────────────────────────────────────────────────

create table if not exists public.city_settings (
  city_slug text primary key,
  luma_calendar_id text,
  luma_public_url text,
  updated_at timestamptz not null default now()
);

alter table public.city_settings enable row level security;

drop policy if exists "Public read city settings" on public.city_settings;
create policy "Public read city settings"
  on public.city_settings
  for select
  to anon, authenticated
  using (true);

-- ── Ambassador profile overrides (one row per city) ──────────────────────────

create table if not exists public.ambassador_settings (
  city_slug text primary key,
  handle text,
  name text,
  photo_url text,
  x_url text,
  linkedin_url text,
  email text,
  updated_at timestamptz not null default now()
);

alter table public.ambassador_settings enable row level security;

drop policy if exists "Public read ambassador settings" on public.ambassador_settings;
create policy "Public read ambassador settings"
  on public.ambassador_settings
  for select
  to anon, authenticated
  using (true);

-- ── Ambassador headshot storage ──────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ambassador-photos',
  'ambassador-photos',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read ambassador photos" on storage.objects;
create policy "Public read ambassador photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'ambassador-photos');
