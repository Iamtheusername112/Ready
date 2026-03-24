-- Run this in Supabase → SQL Editor if you see "Storage bucket missing" for loan KYC uploads.
-- Creates a private bucket for server-side uploads (service role).

insert into storage.buckets (id, name, public)
values ('kyc-uploads', 'kyc-uploads', false)
on conflict (id) do nothing;
