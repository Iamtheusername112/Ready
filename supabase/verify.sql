-- Run in Supabase SQL Editor after applying schema.sql.
-- If `userprofile_exists` is NULL, the table was never created (wrong project or SQL not run).

select to_regclass('public.userprofile') as userprofile_exists;
