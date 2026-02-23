-- ============================================
-- CLEAN START - DROP ALL TABLES FIRST
-- WARNING: This will delete ALL existing data!
-- ============================================

DROP TABLE IF EXISTS career_applications CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS careers CASCADE;
DROP TABLE IF EXISTS catalogs CASCADE;
DROP TABLE IF EXISTS logistics_quotes CASCADE;
DROP TABLE IF EXISTS ai_generated_leads CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS logistics_partners CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

SELECT '✅ All tables dropped! Now run FULL-COMPLETE.sql' as message;
