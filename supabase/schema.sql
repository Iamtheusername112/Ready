-- RetireReady — run in Supabase SQL Editor (or migrate via CLI)
-- Uses Clerk user IDs (text) as primary user keys

create table if not exists public.userprofile (
  id text primary key,
  age integer,
  retirementage integer,
  savings numeric default 0,
  monthlycontrib numeric default 0,
  monthlyexpenses numeric default 0,
  ssstartage integer default 67,
  risktolerance text default 'moderate',
  zip text,
  onboardingcomplete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.advisorleads (
  id uuid primary key default gen_random_uuid(),
  userid text not null references public.userprofile (id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  advisor_id text,
  created_at timestamptz default now()
);

create index if not exists advisorleads_userid_idx on public.advisorleads (userid);
create index if not exists advisorleads_advisor_idx on public.advisorleads (advisor_id);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image text,
  url text not null,
  targetingjson jsonb default '{}'::jsonb
);

create table if not exists public.affiliateoffers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo text,
  link text not null,
  category text not null,
  payout_tier text,
  targetingjson jsonb default '{}'::jsonb
);

create table if not exists public.usersubscription (
  id uuid primary key default gen_random_uuid(),
  userid text not null unique references public.userprofile (id) on delete cascade,
  status text not null default 'inactive',
  stripecustomerid text,
  stripesubid text,
  updated_at timestamptz default now()
);

create table if not exists public.user_budget (
  id uuid primary key default gen_random_uuid(),
  userid text not null references public.userprofile (id) on delete cascade,
  category text not null,
  amount numeric not null default 0,
  unique (userid, category)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  userid text not null references public.userprofile (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists messages_user_created_idx on public.messages (userid, created_at);

-- Premium: saved calculator scenarios (compare "what if" assumptions)
create table if not exists public.saved_scenarios (
  id uuid primary key default gen_random_uuid(),
  userid text not null references public.userprofile (id) on delete cascade,
  name text not null,
  payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists saved_scenarios_user_idx on public.saved_scenarios (userid, created_at desc);

-- Loan pre-qualification / KYC intake (files live in Storage bucket `kyc-uploads`)
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

insert into storage.buckets (id, name, public)
values ('kyc-uploads', 'kyc-uploads', false)
on conflict (id) do nothing;

-- Enable RLS; app uses service role from server actions only (bypasses RLS).
-- For direct client access later, add policies with Clerk JWT.
alter table public.userprofile enable row level security;
alter table public.advisorleads enable row level security;
alter table public.ads enable row level security;
alter table public.affiliateoffers enable row level security;
alter table public.usersubscription enable row level security;
alter table public.user_budget enable row level security;
alter table public.messages enable row level security;
alter table public.saved_scenarios enable row level security;
alter table public.loan_kyc_submissions enable row level security;
