-- Run in Supabase SQL Editor if you already applied an older schema.sql without this table.

create table if not exists public.saved_scenarios (
  id uuid primary key default gen_random_uuid(),
  userid text not null references public.userprofile (id) on delete cascade,
  name text not null,
  payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists saved_scenarios_user_idx on public.saved_scenarios (userid, created_at desc);

alter table public.saved_scenarios enable row level security;
