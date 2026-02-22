-- ============================================
-- SAVIMAN SUPABASE DATABASE SCHEMA v2.0
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMIN USERS TABLE (for role-based access)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    name VARCHAR(100),
    permissions JSONB DEFAULT '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin (SINGLE ADMIN - FULL ACCESS)
INSERT INTO admin_users (email, role, name, permissions) 
VALUES 
    ('satyendra191@gmail.com', 'super_admin', 'Satyendra', '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true, "create": true, "delete": true, "update": true, "read": true}')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_description TEXT,
    long_description TEXT,
    industry_usage TEXT,
    technical_highlights TEXT[],
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    product VARCHAR(255),
    message TEXT,
    attachment_url TEXT,
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'normal',
    assigned_to UUID REFERENCES admin_users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDUSTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image_url TEXT,
    product_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100),
    tags TEXT[],
    featured_image TEXT,
    author VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    views INT DEFAULT 0,
    seo_score INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
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
    updated_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (id, site_name, tagline, contact_email, footer_text)
VALUES (1, 'Saviman Industries', 'Precision Manufacturing Excellence', 'export@saviman.com', '© 2024 Saviman Industries. All rights reserved.')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CMS PAGES TABLE
-- ============================================
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

-- ============================================
-- ANALYTICS TABLE
-- ============================================
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
-- CUSTOM FUNCTIONS FOR ADMIN CHECK
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_email TEXT;
BEGIN
    -- Get the current user's email from auth
    SELECT auth.jwt()->>'email' INTO user_email;
    
    -- If no user, return false
    IF user_email IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if email exists in admin_users and is active
    IF EXISTS (
        SELECT 1 FROM admin_users 
        WHERE email = user_email 
        AND is_active = true
    ) THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check specific permission
CREATE OR REPLACE FUNCTION has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_email TEXT;
    user_permissions JSONB;
BEGIN
    SELECT auth.jwt()->>'email' INTO user_email;
    
    IF user_email IS NULL THEN
        RETURN false;
    END IF;
    
    SELECT permissions INTO user_permissions 
    FROM admin_users 
    WHERE email = user_email AND is_active = true;
    
    IF user_permissions IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN user_permissions->>permission_name = 'true';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current admin info
CREATE OR REPLACE FUNCTION get_current_admin()
RETURNS TABLE(id UUID, email VARCHAR, role VARCHAR, name VARCHAR) AS $$
DECLARE
    user_email TEXT;
BEGIN
    SELECT auth.jwt()->>'email' INTO user_email;
    
    IF user_email IS NULL THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT au.id, au.email, au.role, au.name
    FROM admin_users au
    WHERE au.email = user_email AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ADMIN USERS POLICIES
-- ============================================
CREATE POLICY "Admin users can view all admins" ON admin_users
    FOR SELECT USING (is_admin());

CREATE POLICY "Super admins can manage admins" ON admin_users
    FOR ALL USING (
        is_admin() AND (
            SELECT role FROM admin_users WHERE email = (auth.jwt()->>'email') AND is_active = true
        ) = 'super_admin'
    );

-- ============================================
-- PRODUCTS POLICIES
-- ============================================

-- Public can view active products
DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'active');

-- Admin can do everything with products
DROP POLICY IF EXISTS "Admins can do everything with products" ON products;
CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (is_admin());

-- ============================================
-- INQUIRIES POLICIES
-- ============================================

-- Public can create inquiries
DROP POLICY IF EXISTS "Public can create inquiries" ON inquiries;
CREATE POLICY "Anyone can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- Admin can view all inquiries
DROP POLICY IF EXISTS "Admins can view inquiries" ON inquiries;
CREATE POLICY "Admins can view inquiries" ON inquiries
    FOR SELECT USING (is_admin());

-- Admin can update inquiries
DROP POLICY IF EXISTS "Admins can update inquiries" ON inquiries;
CREATE POLICY "Admins can update inquiries" ON inquiries
    FOR UPDATE USING (is_admin());

-- Admin can delete inquiries
DROP POLICY IF EXISTS "Admins can delete inquiries" ON inquiries;
CREATE POLICY "Admins can delete inquiries" ON inquiries
    FOR DELETE USING (is_admin());

-- ============================================
-- INDUSTRIES POLICIES
-- ============================================

-- Public can view active industries
DROP POLICY IF EXISTS "Public can view active industries" ON industries;
CREATE POLICY "Public can view active industries" ON industries
    FOR SELECT USING (status = 'active');

-- Admin full access
DROP POLICY IF EXISTS "Admins can do everything with industries" ON industries;
CREATE POLICY "Admins can manage industries" ON industries
    FOR ALL USING (is_admin());

-- ============================================
-- BLOG POSTS POLICIES
-- ============================================

-- Public can view published posts
DROP POLICY IF EXISTS "Public can view published blogs" ON blog_posts;
CREATE POLICY "Public can view published blogs" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Admin full access
DROP POLICY IF EXISTS "Admins can do everything with blogs" ON blog_posts;
CREATE POLICY "Admins can manage blogs" ON blog_posts
    FOR ALL USING (is_admin());

-- ============================================
-- SITE SETTINGS POLICIES
-- ============================================

-- Public read access
DROP POLICY IF EXISTS "Public can view settings" ON site_settings;
CREATE POLICY "Public can view settings" ON site_settings
    FOR SELECT USING (true);

-- Admin full access
DROP POLICY IF EXISTS "Admins can update settings" ON site_settings;
CREATE POLICY "Admins can manage settings" ON site_settings
    FOR ALL USING (is_admin());

-- ============================================
-- CMS PAGES POLICIES
-- ============================================

-- Public read access to published pages
DROP POLICY IF EXISTS "Public can view published pages" ON cms_pages;
CREATE POLICY "Public can view published pages" ON cms_pages
    FOR SELECT USING (status = 'published');

-- Admin full access
DROP POLICY IF EXISTS "Admins can do everything with pages" ON cms_pages;
CREATE POLICY "Admins can manage pages" ON cms_pages
    FOR ALL USING (is_admin());

-- ============================================
-- ANALYTICS POLICIES
-- ============================================

-- Anyone can create analytics events
CREATE POLICY "Anyone can track events" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Admins can view analytics
CREATE POLICY "Admins can view analytics" ON analytics_events
    FOR SELECT USING (is_admin());

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Products images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('products', 'products', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Inquiries attachments bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('inquiries', 'inquiries', true, 26214400, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Blog images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Site assets bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('site-assets', 'site-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Public can view all images
CREATE POLICY "Public can view product images" ON storage.objects
    FOR SELECT USING (bucket_id IN ('products', 'blog-images', 'site-assets', 'inquiries'));

-- Admins can upload images
CREATE POLICY "Admins can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('products', 'blog-images', 'site-assets', 'inquiries') AND is_admin());

-- Admins can delete images
CREATE POLICY "Admins can delete product images" ON storage.objects
    FOR DELETE USING (bucket_id IN ('products', 'blog-images', 'site-assets', 'inquiries') AND is_admin());

-- Admins can update images
CREATE POLICY "Admins can update product images" ON storage.objects
    FOR UPDATE USING (bucket_id IN ('products', 'blog-images', 'site-assets', 'inquiries') AND is_admin());

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_slug;
DROP INDEX IF EXISTS idx_products_status;
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(status, featured);

DROP INDEX IF EXISTS idx_inquiries_status;
DROP INDEX IF EXISTS idx_inquiries_created;
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_email ON inquiries(email);

DROP INDEX IF EXISTS idx_blog_posts_status;
DROP INDEX IF EXISTS idx_blog_posts_slug;
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON inquiries;
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_industries_updated_at ON industries;
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON industries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_pages_updated_at ON cms_pages;
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for demo)
-- ============================================

-- Sample products
INSERT INTO products (name, slug, category, short_description, long_description, industry_usage, technical_highlights, image_url, status, featured)
VALUES 
    ('Precision Brass Knurled Inserts', 'brass-knurled-inserts', 'brass', 'High-precision brass inserts for plastic injection molding', 'Premium brass inserts with diamond-knurled pattern for superior torque resistance', 'Electronics, Automotive, Medical', ARRAY['Material: CW614N Brass', 'RoHS Compliant'], 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400', 'active', true),
    ('SS 316 Hydraulic Fittings', 'ss-hydraulic-fittings', 'steel', 'High-pressure hydraulic fittings', 'Stainless steel 316L fittings for extreme pressure applications', 'Oil & Gas, Marine', ARRAY['Grade: SS 316L', 'Up to 10000 PSI'], 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=400', 'active', true),
    ('CNC Precision Turned Parts', 'cnc-precision-parts', 'precision', 'Custom CNC machined components', 'High-precision CNC components with tight tolerances', 'Aerospace, Medical, Automotive', ARRAY['Tolerance: ±0.01mm', '5-Axis CNC'], 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400', 'active', false)
ON CONFLICT (slug) DO NOTHING;

-- Sample industries
INSERT INTO industries (name, slug, description, icon, product_count, status, featured)
VALUES 
    ('Aerospace', 'aerospace', 'Precision components for aerospace applications', '🚀', 45, 'active', true),
    ('Medical Devices', 'medical-devices', 'Surgical-grade precision components', '🏥', 32, 'active', true),
    ('Automotive', 'automotive', 'Automotive parts and components', '🚗', 56, 'active', false),
    ('Oil & Gas', 'oil-gas', 'High-pressure fittings and valves', '⚡', 28, 'active', false)
ON CONFLICT (slug) DO NOTHING;

-- Sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, status, views, featured)
VALUES 
    ('Understanding Brass Grades for Precision Engineering', 'brass-grades-guide', 'Learn about different brass grades and their applications', '## Introduction\n\nBrass is an alloy...', 'Materials', 'published', 1250, true),
    ('ISO 9001:2015 What It Means for Your Supply Chain', 'iso-9001-supply-chain', 'Quality management explained', '## Overview\n\nISO 9001:2015 is...', 'Quality', 'published', 980, false)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
