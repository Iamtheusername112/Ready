-- Run once in Supabase → SQL Editor (same project as NEXT_PUBLIC_SUPABASE_URL).
-- 1) Ensures `targetingjson` exists on `affiliateoffers`
-- 2) Inserts sample partner rows (skips any row whose `name` already exists)

alter table public.affiliateoffers
  add column if not exists targetingjson jsonb default '{}'::jsonb;

comment on column public.affiliateoffers.targetingjson is
  'Optional filters: minAge, maxAge, zipPrefix, riskTolerance (conservative|moderate|aggressive), minYearsToRetirement, maxYearsToRetirement. Empty {} = show to everyone.';

insert into public.affiliateoffers (name, description, logo, link, category, payout_tier, targetingjson)
select name, description, logo, link, category, payout_tier, targetingjson
from (
  values
    (
      'Social Security — official tools',
      'Estimate benefits, review your statement, and compare start ages using SSA’s own calculators.',
      null::text,
      'https://www.ssa.gov/benefits/retirement/',
      'Income & benefits',
      null::text,
      '{"maxYearsToRetirement": 20}'::jsonb
    ),
    (
      'Investor.gov — retirement basics',
      'SEC educational resources on fees, diversification, and avoiding fraud near retirement.',
      null::text,
      'https://www.investor.gov/',
      'Education',
      null::text,
      '{}'::jsonb
    ),
    (
      'FINRA BrokerCheck',
      'Look up licenses and disclosures before working with a broker or investment adviser.',
      null::text,
      'https://brokercheck.finra.org/',
      'Due diligence',
      null::text,
      '{"minAge": 55}'::jsonb
    ),
    (
      'National Foundation for Credit Counseling',
      'Nonprofit help with budgeting and debt — useful if you are tightening spending before retirement.',
      null::text,
      'https://www.nfcc.org/',
      'Money & debt',
      null::text,
      '{"maxYearsToRetirement": 12}'::jsonb
    ),
    (
      'Medicare.gov',
      'Official Medicare enrollment, coverage, and costs — useful as you approach age 65.',
      null::text,
      'https://www.medicare.gov/',
      'Healthcare',
      null::text,
      '{"minAge": 60}'::jsonb
    ),
    (
      'IRS — retirement plans (401k, IRA)',
      'IRS guidance on contribution limits, required distributions, and plan types.',
      null::text,
      'https://www.irs.gov/retirement-plans',
      'Education',
      null::text,
      '{}'::jsonb
    )
) as v(name, description, logo, link, category, payout_tier, targetingjson)
where not exists (
  select 1 from public.affiliateoffers a where a.name = v.name
);
