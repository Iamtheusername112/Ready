-- Replace last-4-only columns with full ssn / tax_id (9 digits stored by the app after normalization).
-- Run after 003 if you already created loan_kyc_submissions with last4_ssn / tax_id_last4.

alter table public.loan_kyc_submissions drop column if exists last4_ssn;
alter table public.loan_kyc_submissions drop column if exists tax_id_last4;

alter table public.loan_kyc_submissions add column if not exists ssn text;
alter table public.loan_kyc_submissions add column if not exists tax_id text;

-- Legacy rows cannot hold full IDs; remove so NOT NULL can apply (re-submit via app if needed).
delete from public.loan_kyc_submissions where ssn is null or tax_id is null;

alter table public.loan_kyc_submissions alter column ssn set not null;
alter table public.loan_kyc_submissions alter column tax_id set not null;
