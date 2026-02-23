-- ============================================
-- COMPLETE BACKEND FIX - For existing database
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE MISSING TABLES IF NOT EXISTS
-- ============================================

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name VARCHAR(255),
    tagline VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    google_maps_embed TEXT,
    footer_text TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    social_links JSONB DEFAULT '{}',
    seo_settings JSONB DEFAULT '{}',
    theme_settings JSONB DEFAULT '{}',
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
INSERT INTO site_settings (id, site_name, tagline, contact_email, footer_text)
VALUES (1, 'Saviman Industries', 'Precision Manufacturing Excellence', 'export@saviman.com', '© ' || EXTRACT(YEAR FROM NOW()) || ' Saviman Industries. All rights reserved.')
ON CONFLICT (id) DO NOTHING;

-- CMS Pages
CREATE TABLE IF NOT EXISTS cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    sections JSONB DEFAULT '[]',
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    template VARCHAR(50) DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ADD MISSING COLUMNS (Only runs if table exists)
-- ============================================

DO $$
BEGIN
    -- Products
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'products') THEN
        ALTER TABLE products ADD COLUMN IF NOT EXISTS model_name VARCHAR(100);
        ALTER TABLE products ADD COLUMN IF NOT EXISTS version VARCHAR(50);
        ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS brochure_url TEXT;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
    END IF;
    
    -- Industries
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'industries') THEN
        ALTER TABLE industries ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
        ALTER TABLE industries ADD COLUMN IF NOT EXISTS product_count INT DEFAULT 0;
    END IF;
    
    -- Inquiries
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'inquiries') THEN
        ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS company VARCHAR(255);
        ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS attachment_url TEXT;
        ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';
    END IF;
    
    -- Blog Posts
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'blog_posts') THEN
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image TEXT;
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author VARCHAR(100);
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[];
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;
    END IF;
END $$;

-- ============================================
-- ENABLE RLS & POLICIES (Only if table exists)
-- ============================================

-- Admin Users
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_users') THEN
        ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Site Settings
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'site_settings') THEN
        ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
        DROP POLICY IF EXISTS "Admin can manage settings" ON site_settings;
        CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
        CREATE POLICY "Admin can manage settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- CMS Pages
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cms_pages') THEN
        ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public can view pages" ON cms_pages;
        DROP POLICY IF EXISTS "Admin can manage pages" ON cms_pages;
        CREATE POLICY "Public can view pages" ON cms_pages FOR SELECT USING (status = 'published' OR status IS NULL);
        CREATE POLICY "Admin can manage pages" ON cms_pages FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Analytics Events
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'analytics_events') THEN
        ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Anyone can create analytics" ON analytics_events;
        DROP POLICY IF EXISTS "Admin can view analytics" ON analytics_events;
        CREATE POLICY "Anyone can create analytics" ON analytics_events FOR INSERT WITH CHECK (true);
        CREATE POLICY "Admin can view analytics" ON analytics_events FOR SELECT USING (true);
    END IF;
END $$;

-- Products
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'products') THEN
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public can view products" ON products;
        DROP POLICY IF EXISTS "Admin can manage products" ON products;
        CREATE POLICY "Public can view products" ON products FOR SELECT USING (status = 'active' OR status IS NULL);
        CREATE POLICY "Admin can manage products" ON products FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Industries
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'industries') THEN
        ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public can view industries" ON industries;
        DROP POLICY IF EXISTS "Admin can manage industries" ON industries;
        CREATE POLICY "Public can view industries" ON industries FOR SELECT USING (status = 'active' OR status IS NULL);
        CREATE POLICY "Admin can manage industries" ON industries FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Inquiries
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'inquiries') THEN
        ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Anyone can create inquiries" ON inquiries;
        DROP POLICY IF EXISTS "Admin can manage inquiries" ON inquiries;
        CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);
        CREATE POLICY "Admin can manage inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Leads
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'leads') THEN
        ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
        DROP POLICY IF EXISTS "Admin can manage leads" ON leads;
        CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);
        CREATE POLICY "Admin can manage leads" ON leads FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Catalogs
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'catalogs') THEN
        ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public can view catalogs" ON catalogs;
        DROP POLICY IF EXISTS "Admin can manage catalogs" ON catalogs;
        CREATE POLICY "Public can view catalogs" ON catalogs FOR SELECT USING (status = 'active' OR status IS NULL);
        CREATE POLICY "Admin can manage catalogs" ON catalogs FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Careers
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'careers') THEN
        ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public can view careers" ON careers;
        DROP POLICY IF EXISTS "Admin can manage careers" ON careers;
        CREATE POLICY "Public can view careers" ON careers FOR SELECT USING (status = 'active' OR status IS NULL);
        CREATE POLICY "Admin can manage careers" ON careers FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

SELECT '✅ Backend fix completed successfully!' as message;
