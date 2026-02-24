-- ============================================
-- ANTIGRAVIT OPENCODE - CLEANUP / RESET SCRIPT
-- WARNING: This will delete ALL data and tables
-- ============================================

-- Drop triggers first to avoid dependencies
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public') LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || r.trigger_name || ' ON ' || r.event_object_table || ';';
    END LOOP;
END $$;

-- Drop functions
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || r.routine_name || ' CASCADE;';
    END LOOP;
END $$;

-- Drop all tables in public schema
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE;';
    END LOOP;
END $$;

-- Drop all types
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typtype = 'e') LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || r.typname || ' CASCADE;';
    END LOOP;
END $$;

-- Clean up storage buckets (if you want to reset media as well)
-- DELETE FROM storage.objects;
-- DELETE FROM storage.buckets;

-- Clean up auth users (use with caution, usually handled by Supabase Dashboard)
-- DELETE FROM auth.users;

RAISE NOTICE 'Public schema has been completely cleaned.';
