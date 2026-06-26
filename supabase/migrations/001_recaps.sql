-- Event recaps (ambassador admin) + public photo bucket.
-- Run in Supabase Dashboard → SQL Editor → New query → Run.

-- ── Table ────────────────────────────────────────────────────────────────────

create table if not exists public.recaps (
  event_slug text primary key,
  city_slug text not null,
  summary text not null default '',
  photo_credit text,
  photos jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists recaps_city_slug_idx on public.recaps (city_slug);
create index if not exists recaps_updated_at_idx on public.recaps (updated_at desc);

alter table public.recaps enable row level security;

drop policy if exists "Public read recaps" on public.recaps;
create policy "Public read recaps"
  on public.recaps
  for select
  to anon, authenticated
  using (true);

-- Writes go through the website API using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

-- ── Storage bucket (recap photos) ────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recap-photos',
  'recap-photos',
  true,
  12582912,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read recap photos" on storage.objects;
create policy "Public read recap photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'recap-photos');
