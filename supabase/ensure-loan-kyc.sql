-- Run once in Supabase → SQL Editor if you see:
-- "Could not find the table 'public.loan_kyc_submissions' in the schema cache"
-- Requires public.userprofile to already exist.

create table if not exists public.loan_kyc_submissions (
  id uuid primary key,
  userid text not null references public.userprofile (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  ssn text not null,
  tax_id text not null,
  attachment_paths jsonb not null default '{}'::jsonb,
  consent_at timestamptz not null,
  created_at timestamptz default now()
);

create index if not exists loan_kyc_user_idx on public.loan_kyc_submissions (userid, created_at desc);

alter table public.loan_kyc_submissions enable row level security;

insert into storage.buckets (id, name, public)
values ('kyc-uploads', 'kyc-uploads', false)
on conflict (id) do nothing;
