-- Deprecated: use `seed-partner-offers.sql` instead (adds column + sample rows in one script).
-- If you only need the column on an existing DB:
alter table public.affiliateoffers
  add column if not exists targetingjson jsonb default '{}'::jsonb;
