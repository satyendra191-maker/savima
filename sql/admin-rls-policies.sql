-- ============================================
-- SAVIMAN RLS POLICIES - ADMIN ONLY WITH PASSWORD
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- SETUP ADMIN PASSWORD (change this!)
-- ============================================
-- Set your admin password in Supabase Dashboard:
-- Go to Settings → Database → Database Configuration
-- Add a new config: "ADMIN_SECRET_KEY" with your password
-- Or just use the default below for now

-- ============================================
-- ADDITIONAL TABLES NEEDED FOR ADMIN
-- ============================================

-- Career Applications Table
CREATE TABLE IF NOT EXISTS career_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    position VARCHAR(255),
    resume_url TEXT,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    message TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Catalogs Table
CREATE TABLE IF NOT EXISTS catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    pages INT,
    size VARCHAR(50),
    thumbnail TEXT,
    download_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    order_id VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    shipping_address TEXT,
    product_details TEXT,
    weight DECIMAL(10,2),
    dimensions VARCHAR(100),
    logistic_partner VARCHAR(100),
    status VARCHAR(50) DEFAULT 'processing',
    current_location TEXT,
    estimated_delivery DATE,
    tracking_updates JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logistics Partners Table
CREATE TABLE IF NOT EXISTS logistics_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    api_endpoint TEXT,
    tracking_url_template TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE RLS ON NEW TABLES
-- ============================================

ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNCTION TO CHECK ADMIN KEY
-- ============================================

-- Function that checks if the request has valid admin secret
CREATE OR REPLACE FUNCTION is_admin_request()
RETURNS BOOLEAN AS $$
DECLARE
    admin_key TEXT;
    provided_key TEXT;
BEGIN
    -- Get the admin key from env (set in Supabase Dashboard)
    admin_key := NULLIF(current_setting('app.ADMIN_SECRET_KEY', true), '');
    
    -- If no admin key configured, check for a default
    IF admin_key IS NULL OR admin_key = '' THEN
        -- Default admin key - CHANGE THIS!
        admin_key := 'saviman_admin_2024';
    END IF;
    
    -- Get the provided key from request headers
    provided_key := NULLIF(current_setting('request.headers', true)::jsonb->>'x-admin-key', '');
    
    -- Check if keys match
    IF provided_key = admin_key THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ADMIN ONLY RLS POLICIES
-- ============================================

-- ============================================
-- PRODUCTS - Admin Only
-- ============================================
ALTER TABLE products DROP POLICY IF EXISTS "Public can view active products";
ALTER TABLE products DROP POLICY IF EXISTS "Public Read Products";
ALTER TABLE products DROP POLICY IF EXISTS "Admins can do everything with products";
ALTER TABLE products DROP POLICY IF EXISTS "Admin All Products";

CREATE POLICY "Products admin only" ON products
    FOR ALL USING (is_admin_request());

-- ============================================
-- INQUIRIES - Admin Only (no public insert)
-- ============================================
ALTER TABLE inquiries DROP POLICY IF EXISTS "Public Insert Inquiries";
ALTER TABLE inquiries DROP POLICY IF EXISTS "Public can create inquiries";
ALTER TABLE inquiries DROP POLICY IF EXISTS "Admin All Inquiries";

CREATE POLICY "Inquiries admin only" ON inquiries
    FOR ALL USING (is_admin_request());

-- ============================================
-- INDUSTRIES - Admin Only
-- ============================================
ALTER TABLE industries DROP POLICY IF EXISTS "Public can view active industries";
ALTER TABLE industries DROP POLICY IF EXISTS "Admins can do everything with industries";

CREATE POLICY "Industries admin only" ON industries
    FOR ALL USING (is_admin_request());

-- ============================================
-- BLOG POSTS - Admin Only
-- ============================================
ALTER TABLE blog_posts DROP POLICY IF EXISTS "Public can view published blogs";
ALTER TABLE blog_posts DROP POLICY IF EXISTS "Admins can do everything with blogs";

CREATE POLICY "Blogs admin only" ON blog_posts
    FOR ALL USING (is_admin_request());

-- ============================================
-- SITE SETTINGS - Admin Only
-- ============================================
ALTER TABLE site_settings DROP POLICY IF EXISTS "Public can view settings";
ALTER TABLE site_settings DROP POLICY IF EXISTS "Public Read Settings";
ALTER TABLE site_settings DROP POLICY IF EXISTS "Admins can update settings";
ALTER TABLE site_settings DROP POLICY IF EXISTS "Admin All Settings";

CREATE POLICY "Settings admin only" ON site_settings
    FOR ALL USING (is_admin_request());

-- ============================================
-- CMS PAGES - Admin Only
-- ============================================
ALTER TABLE cms_pages DROP POLICY IF EXISTS "Public can view published pages";
ALTER TABLE cms_pages DROP POLICY IF EXISTS "Public Read Pages";
ALTER TABLE cms_pages DROP POLICY IF EXISTS "Admins can do everything with pages";
ALTER TABLE cms_pages DROP POLICY IF EXISTS "Admin All Pages";

CREATE POLICY "Pages admin only" ON cms_pages
    FOR ALL USING (is_admin_request());

-- ============================================
-- CAREER APPLICATIONS - Admin Only
-- ============================================
ALTER TABLE career_applications DROP POLICY IF EXISTS "Anyone can apply for careers";
ALTER TABLE career_applications DROP POLICY IF EXISTS "Public can apply for careers";

CREATE POLICY "Careers admin only" ON career_applications
    FOR ALL USING (is_admin_request());

-- ============================================
-- DONATIONS - Admin Only
-- ============================================
ALTER TABLE donations DROP POLICY IF EXISTS "Anyone can donate";
ALTER TABLE donations DROP POLICY IF EXISTS "Public can donate";

CREATE POLICY "Donations admin only" ON donations
    FOR ALL USING (is_admin_request());

-- ============================================
-- CATALOGS - Admin Only
-- ============================================
ALTER TABLE catalogs DROP POLICY IF EXISTS "Public can view active catalogs";

CREATE POLICY "Catalogs admin only" ON catalogs
    FOR ALL USING (is_admin_request());

-- ============================================
-- SHIPMENTS - Admin Only
-- ============================================
ALTER TABLE shipments DROP POLICY IF EXISTS "Public can track shipments";

CREATE POLICY "Shipments admin only" ON shipments
    FOR ALL USING (is_admin_request());

-- ============================================
-- LOGISTICS PARTNERS - Admin Only
-- ============================================
ALTER TABLE logistics_partners DROP POLICY IF EXISTS "Public can view active partners";

CREATE POLICY "Logistics admin only" ON logistics_partners
    FOR ALL USING (is_admin_request());

-- ============================================
-- ANALYTICS - Admin Only
-- ============================================
ALTER TABLE analytics_events DROP POLICY IF EXISTS "Anyone can track events";
ALTER TABLE analytics_events DROP POLICY IF EXISTS "Admins can view analytics";

CREATE POLICY "Analytics admin only" ON analytics_events
    FOR ALL USING (is_admin_request());

-- ============================================
-- ADMIN USERS - Admin Only
-- ============================================
ALTER TABLE admin_users DROP POLICY IF EXISTS "Admin users can view all admins";
ALTER TABLE admin_users DROP POLICY IF EXISTS "Super admins can manage admins";

CREATE POLICY "Admin users admin only" ON admin_users
    FOR ALL USING (is_admin_request());

-- ============================================
-- STORAGE - Admin Only
-- ============================================

ALTER TABLE storage.objects DROP POLICY IF EXISTS "Public can view product images";
ALTER TABLE storage.objects DROP POLICY IF EXISTS "Public Read Products Bucket";
ALTER TABLE storage.objects DROP POLICY IF EXISTS "Public Write Inquiries Bucket";
ALTER TABLE storage.objects DROP POLICY IF EXISTS "Admins can upload product images";
ALTER TABLE storage.objects DROP POLICY IF EXISTS "Admins can delete product images";
ALTER TABLE storage.objects DROP POLICY IF EXISTS "Admins can update product images";

CREATE POLICY "Storage admin only" ON storage.objects
    FOR ALL USING (
        bucket_id IN ('products', 'blog-images', 'site-assets', 'inquiries', 'documents')
        AND is_admin_request()
    );

-- ============================================
-- CREATE STORAGE BUCKETS IF NOT EXIST
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('documents', 'documents', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TRIGGERS FOR NEW TABLES
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_career_applications_updated_at ON career_applications;
CREATE TRIGGER update_career_applications_updated_at BEFORE UPDATE ON career_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_catalogs_updated_at ON catalogs;
CREATE TRIGGER update_catalogs_updated_at BEFORE UPDATE ON catalogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipments_updated_at ON shipments;
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_logistics_partners_updated_at ON logistics_partners;
CREATE TRIGGER update_logistics_partners_updated_at BEFORE UPDATE ON logistics_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_career_applications_status ON career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_applications_created ON career_applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_catalogs_status ON catalogs(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);

-- ============================================
-- RELOAD SCHEMA
-- ============================================
NOTIFY pgrst, 'reload schema';

-- ============================================
-- DONE!
-- ============================================
