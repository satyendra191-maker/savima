-- ============================================
-- COMPLETE BACKEND FIX - For existing database
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADD MISSING COLUMNS (Only runs if column doesn't exist)
-- ============================================

-- Products
ALTER TABLE products ADD COLUMN IF NOT EXISTS model_name VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS version VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brochure_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];

-- Products
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Industries
DROP POLICY IF EXISTS "Public can view industries" ON industries;
DROP POLICY IF EXISTS "Admin can manage industries" ON industries;
CREATE POLICY "Public can view industries" ON industries FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage industries" ON industries FOR ALL USING (true) WITH CHECK (true);

-- Inquiries
DROP POLICY IF EXISTS "Anyone can create inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can manage inquiries" ON inquiries;
CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

-- Leads
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Admin can manage leads" ON leads;
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage leads" ON leads FOR ALL USING (true) WITH CHECK (true);

-- AI Generated Leads
DROP POLICY IF EXISTS "Anyone can create ai_leads" ON ai_generated_leads;
DROP POLICY IF EXISTS "Admin can manage ai_leads" ON ai_generated_leads;
CREATE POLICY "Anyone can create ai_leads" ON ai_generated_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage ai_leads" ON ai_generated_leads FOR ALL USING (true) WITH CHECK (true);

-- Catalogs
DROP POLICY IF EXISTS "Public can view catalogs" ON catalogs;
DROP POLICY IF EXISTS "Admin can manage catalogs" ON catalogs;
CREATE POLICY "Public can view catalogs" ON catalogs FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage catalogs" ON catalogs FOR ALL USING (true) WITH CHECK (true);

-- Careers
DROP POLICY IF EXISTS "Public can view careers" ON careers;
DROP POLICY IF EXISTS "Admin can manage careers" ON careers;
CREATE POLICY "Public can view careers" ON careers FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage careers" ON careers FOR ALL USING (true) WITH CHECK (true);

-- Career Applications
DROP POLICY IF EXISTS "Anyone can apply for jobs" ON career_applications;
DROP POLICY IF EXISTS "Admin can manage applications" ON career_applications;
CREATE POLICY "Anyone can apply for jobs" ON career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage applications" ON career_applications FOR ALL USING (true) WITH CHECK (true);

-- Blog Posts
DROP POLICY IF EXISTS "Public can view blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can manage blog_posts" ON blog_posts;
CREATE POLICY "Public can view blog_posts" ON blog_posts FOR SELECT USING (status = 'published' OR status IS NULL);
CREATE POLICY "Admin can manage blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

-- Shipments
DROP POLICY IF EXISTS "Public can track shipments" ON shipments;
DROP POLICY IF EXISTS "Admin can manage shipments" ON shipments;
CREATE POLICY "Public can track shipments" ON shipments FOR SELECT USING (true);
CREATE POLICY "Admin can manage shipments" ON shipments FOR ALL USING (true) WITH CHECK (true);

-- Logistics Partners
DROP POLICY IF EXISTS "Public can view partners" ON logistics_partners;
DROP POLICY IF EXISTS "Admin can manage partners" ON logistics_partners;
CREATE POLICY "Public can view partners" ON logistics_partners FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage partners" ON logistics_partners FOR ALL USING (true) WITH CHECK (true);

-- Logistics Quotes
DROP POLICY IF EXISTS "Anyone can create quotes" ON logistics_quotes;
DROP POLICY IF EXISTS "Admin can manage quotes" ON logistics_quotes;
CREATE POLICY "Anyone can create quotes" ON logistics_quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage quotes" ON logistics_quotes FOR ALL USING (true) WITH CHECK (true);

-- CMS Pages
DROP POLICY IF EXISTS "Public can view pages" ON cms_pages;
DROP POLICY IF EXISTS "Admin can manage pages" ON cms_pages;
CREATE POLICY "Public can view pages" ON cms_pages FOR SELECT USING (status = 'published' OR status IS NULL);
CREATE POLICY "Admin can manage pages" ON cms_pages FOR ALL USING (true) WITH CHECK (true);

-- Site Settings
DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON site_settings;
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- Analytics Events
DROP POLICY IF EXISTS "Anyone can create analytics" ON analytics_events;
DROP POLICY IF EXISTS "Admin can view analytics" ON analytics_events;
CREATE POLICY "Anyone can create analytics" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view analytics" ON analytics_events FOR SELECT USING (true);

-- Admin Users
DROP POLICY IF EXISTS "Admin can manage users" ON admin_users;
CREATE POLICY "Admin can manage users" ON admin_users FOR ALL USING (true) WITH CHECK (true);

SELECT '✅ All tables and policies created successfully!' as message;
