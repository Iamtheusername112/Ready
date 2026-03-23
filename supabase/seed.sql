-- Optional seed data for development (run after schema.sql)

insert into public.ads (title, description, image, url, targetingjson)
values
  (
    'Plan with confidence',
    'Compare low-cost retirement accounts tailored to your age.',
    'https://placehold.co/320x180/e0f2fe/0369a1?text=Retirement+Ad',
    'https://example.com/ad1',
    '{"minAge": 50}'::jsonb
  ),
  (
    'Protect your nest egg',
    'Insurance options for retirees in your area.',
    'https://placehold.co/320x180/dcfce7/166534?text=Insurance',
    'https://example.com/ad2',
    '{}'::jsonb
  );

insert into public.affiliateoffers (name, description, logo, link, category, payout_tier)
values
  (
    'Sample Brokerage',
    'Commission-free trades and retirement tools.',
    'https://placehold.co/64x64/f3f4f6/111827?text=B',
    'https://example.com/broker',
    'Brokerage accounts',
    'Tier A'
  ),
  (
    'Health Savings Hub',
    'Triple tax advantages for medical costs in retirement.',
    'https://placehold.co/64x64/f3f4f6/111827?text=H',
    'https://example.com/hsa',
    'HSA',
    'Tier B'
  ),
  (
    'Robo Retire',
    'Automated portfolios with glide paths to retirement.',
    'https://placehold.co/64x64/f3f4f6/111827?text=R',
    'https://example.com/robo',
    'Robo-advisors',
    'Tier A'
  );
