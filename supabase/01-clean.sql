-- ============================================
-- STEP 1: CLEAN - DROP ALL EXISTING TABLES
-- WARNING: This will delete all existing data!
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
DROP TABLE IF EXISTS cms_pages CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;

SELECT '✅ All tables dropped!' as message;
