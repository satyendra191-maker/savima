-- =====================================================
-- SAVIMAN SUPABASE DATABASE SCHEMA (FIXED)
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES (if any conflicts)
-- =====================================================
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS visitor_sessions CASCADE;
DROP TABLE IF EXISTS logistics_partners CASCADE;
DROP TABLE IF EXISTS logistics_quotes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS catalogs CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS career_applications CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS cms_pages CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS ai_generated_leads CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- =====================================================
-- 1. PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT,
    long_description TEXT,
    industry_usage TEXT,
    technical_highlights TEXT[],
    image_url TEXT,
    model_name TEXT,
    version TEXT,
    specifications JSONB DEFAULT '{}',
    brochure_url TEXT,
    images TEXT[],
    status TEXT DEFAULT 'active',
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. INQUIRIES TABLE
-- =====================================================
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    product TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. LEADS TABLE
-- =====================================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company_name TEXT,
    country_code TEXT,
    requirement_description TEXT,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'normal',
    buying_intent_score INTEGER,
    assigned_to TEXT,
    notes TEXT,
    converted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. AI GENERATED LEADS TABLE
-- =====================================================
CREATE TABLE ai_generated_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT,
    person_name TEXT,
    company_name TEXT,
    country_code TEXT,
    contact_number TEXT,
    email TEXT,
    requirement_description TEXT,
    conversation_summary TEXT,
    buying_intent_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    is_partial BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'Saviman Industries',
    contact_email TEXT DEFAULT 'export@saviman.com',
    contact_phone TEXT DEFAULT '+91 95069 43134',
    address TEXT DEFAULT 'Jamnagar, Gujarat, INDIA',
    social_links JSONB DEFAULT '{}',
    footer_text TEXT DEFAULT '© 2024 Saviman Industries',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. CMS PAGES TABLE
-- =====================================================
CREATE TABLE cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    sections JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. INDUSTRIES TABLE
-- =====================================================
CREATE TABLE industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    author TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. CAREER APPLICATIONS TABLE
-- =====================================================
CREATE TABLE career_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. DOCUMENTS TABLE
-- =====================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. DONATIONS TABLE
-- =====================================================
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    transaction_id TEXT,
    payment_status TEXT DEFAULT 'pending',
    anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 12. CATALOGS TABLE
-- =====================================================
CREATE TABLE catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT,
    download_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 13. SHIPMENTS TABLE
-- =====================================================
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID,
    tracking_number TEXT UNIQUE,
    carrier TEXT NOT NULL,
    current_status TEXT DEFAULT 'pending',
    origin_address TEXT,
    destination_address TEXT,
    estimated_delivery TIMESTAMPTZ,
    actual_delivery TIMESTAMPTZ,
    weight_kg DECIMAL(10,2),
    dimensions TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 14. ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending',
    shipment_status TEXT DEFAULT 'pending',
    items JSONB DEFAULT '[]',
    shipping_address JSONB,
    billing_address JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 15. LOGISTICS QUOTES TABLE
-- =====================================================
CREATE TABLE logistics_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID,
    product_name TEXT,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT,
    delivery_address TEXT,
    weight DECIMAL(10,2),
    dimensions TEXT,
    estimated_cost DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    logistic_partner TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 16. LOGISTICS PARTNERS TABLE
-- =====================================================
CREATE TABLE logistics_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    is_intl BOOLEAN DEFAULT FALSE,
    countries TEXT[],
    services TEXT[],
    estimated_days INTEGER,
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    contact_email TEXT,
    contact_phone TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 17. VISITOR SESSIONS TABLE
-- =====================================================
CREATE TABLE visitor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    city TEXT,
    page_views INTEGER DEFAULT 0,
    pages_visited TEXT[],
    first_visit TIMESTAMPTZ DEFAULT NOW(),
    last_visit TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INTEGER DEFAULT 0
);

-- =====================================================
-- 18. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('saviman-products', 'saviman-products', true),
    ('saviman-inquiries', 'saviman-inquiries', true),
    ('saviman-documents', 'saviman-documents', true),
    ('saviman-catalogs', 'saviman-catalogs', true),
    ('saviman-blog', 'saviman-blog', true),
    ('saviman-avatars', 'saviman-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public access to products" ON storage.objects;
CREATE POLICY "Public access to products" ON storage.objects FOR SELECT USING (bucket_id = 'saviman-products');

DROP POLICY IF EXISTS "Public access to inquiries" ON storage.objects;
CREATE POLICY "Public access to inquiries" ON storage.objects FOR SELECT USING (bucket_id = 'saviman-inquiries');

DROP POLICY IF EXISTS "Upload to inquiries" ON storage.objects;
CREATE POLICY "Upload to inquiries" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'saviman-inquiries');

DROP POLICY IF EXISTS "Public access to documents" ON storage.objects;
CREATE POLICY "Public access to documents" ON storage.objects FOR SELECT USING (bucket_id = 'saviman-documents');

DROP POLICY IF EXISTS "Public access to catalogs" ON storage.objects;
CREATE POLICY "Public access to catalogs" ON storage.objects FOR SELECT USING (bucket_id = 'saviman-catalogs');

DROP POLICY IF EXISTS "Public access to blog" ON storage.objects;
CREATE POLICY "Public access to blog" ON storage.objects FOR SELECT USING (bucket_id = 'saviman-blog');

DROP POLICY IF EXISTS "Public access to avatars" ON storage.objects;
CREATE POLICY "Public access to avatars" ON storage.objects FOR SELECT USING (bucket_id = 'saviman-avatars');

DROP POLICY IF EXISTS "Upload to avatars" ON storage.objects;
CREATE POLICY "Upload to avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'saviman-avatars');

-- =====================================================
-- RLS POLICIES (Secure Role-Based Access Control)
-- =====================================================

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    CURRENT_SETTING('request.jwt.claims', TRUE)::JSON->>'role',
    'guest'
  ) IN ('admin', 'super_admin', 'sales_manager', 'inventory_manager');
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Public read, admin write
CREATE POLICY "Public read products" ON products FOR SELECT USING (TRUE);
CREATE POLICY "Admin write products" ON products FOR ALL USING (is_admin());

-- INQUIRIES: Public insert only, admin full access
CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin read inquiries" ON inquiries FOR SELECT USING (is_admin());
CREATE POLICY "Admin write inquiries" ON inquiries FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete inquiries" ON inquiries FOR DELETE USING (is_admin());

-- LEADS: Public insert only, admin full access
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin read leads" ON leads FOR SELECT USING (is_admin());
CREATE POLICY "Admin write leads" ON leads FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete leads" ON leads FOR DELETE USING (is_admin());

-- AI GENERATED LEADS: Public insert only, admin full access
CREATE POLICY "Public insert ai_leads" ON ai_generated_leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin read ai_leads" ON ai_generated_leads FOR SELECT USING (is_admin());
CREATE POLICY "Admin write ai_leads" ON ai_generated_leads FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete ai_leads" ON ai_generated_leads FOR DELETE USING (is_admin());

-- SITE SETTINGS: Public read, admin write
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL USING (is_admin());

-- CMS PAGES: Public read, admin write
CREATE POLICY "Public read cms_pages" ON cms_pages FOR SELECT USING (TRUE);
CREATE POLICY "Admin write cms_pages" ON cms_pages FOR ALL USING (is_admin());

-- INDUSTRIES: Public read, admin write
CREATE POLICY "Public read industries" ON industries FOR SELECT USING (TRUE);
CREATE POLICY "Admin write industries" ON industries FOR ALL USING (is_admin());

-- BLOG POSTS: Public read published, admin full access
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admin write blog_posts" ON blog_posts FOR ALL USING (is_admin());

-- CAREER APPLICATIONS: Public insert only, admin full access
CREATE POLICY "Public insert careers" ON career_applications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin read careers" ON career_applications FOR SELECT USING (is_admin());
CREATE POLICY "Admin write careers" ON career_applications FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete careers" ON career_applications FOR DELETE USING (is_admin());

-- DOCUMENTS: Admin only (internal files)
CREATE POLICY "Admin documents" ON documents FOR ALL USING (is_admin());

-- DONATIONS: Public insert only, admin full access
CREATE POLICY "Public insert donations" ON donations FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin read donations" ON donations FOR SELECT USING (is_admin());
CREATE POLICY "Admin write donations" ON donations FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete donations" ON donations FOR DELETE USING (is_admin());

-- CATALOGS: Public read, admin write
CREATE POLICY "Public read catalogs" ON catalogs FOR SELECT USING (TRUE);
CREATE POLICY "Admin write catalogs" ON catalogs FOR ALL USING (is_admin());

-- SHIPMENTS: Admin only (sensitive logistics data)
CREATE POLICY "Admin shipments" ON shipments FOR ALL USING (is_admin());

-- ORDERS: Public insert only, admin full access
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin read orders" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "Admin write orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete orders" ON orders FOR DELETE USING (is_admin());

-- LOGISTICS QUOTES: Public insert only, admin full access
CREATE POLICY "Public insert logistics_quotes" ON logistics_quotes FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin read logistics_quotes" ON logistics_quotes FOR SELECT USING (is_admin());
CREATE POLICY "Admin write logistics_quotes" ON logistics_quotes FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete logistics_quotes" ON logistics_quotes FOR DELETE USING (is_admin());

-- LOGISTICS PARTNERS: Public read, admin write
CREATE POLICY "Public read logistics_partners" ON logistics_partners FOR SELECT USING (TRUE);
CREATE POLICY "Admin write logistics_partners" ON logistics_partners FOR ALL USING (is_admin());

-- VISITOR SESSIONS: Admin only (analytics data)
CREATE POLICY "Admin visitor_sessions" ON visitor_sessions FOR ALL USING (is_admin());

-- AUDIT LOGS: Admin only (security audit trail)
CREATE POLICY "Admin audit_logs" ON audit_logs FOR ALL USING (is_admin());

-- =====================================================
-- SEED DATA
-- =====================================================

-- Products
INSERT INTO products (name, slug, category, short_description, long_description, industry_usage, technical_highlights, image_url, status) VALUES
('Brass Knurled Insert', 'brass-knurled-insert', 'brass', 'Precision brass knurled inserts', 'High-quality brass knurled inserts with superior torque.', 'Automotive, Electronics', ARRAY['CW614N Brass', '±0.01mm'], 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 'active'),
('CNC Turned Component', 'cnc-turned-component', 'precision', 'CNC turned components', 'Precision CNC turned parts with ±0.005mm tolerance.', 'Automotive, Electronics', ARRAY['5-Axis CNC'], 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=600', 'active'),
('SS Hex Bolt', 'ss-hex-bolt', 'steel', 'Stainless steel bolts', 'High-grade stainless steel nuts and bolts.', 'Construction, Oil & Gas', ARRAY['SS 304/316'], 'https://images.unsplash.com/photo-16297316323ec-449301934960?w=600', 'active'),
('Hydraulic Fitting', 'hydraulic-fitting', 'hydraulic', 'Hydraulic fittings', 'Premium hydraulic fittings rated for 10000 PSI.', 'Oil & Gas, Marine', ARRAY['SS 316L'], 'https://images.unsplash.com/photo-1504917595217-d4dc5f649776?w=600', 'active')
ON CONFLICT (slug) DO NOTHING;

-- Industries
INSERT INTO industries (name, slug, description, icon) VALUES
('Automotive', 'automotive', 'Precision components for automotive', 'car'),
('Electronics', 'electronics', 'Electronic components', 'cpu'),
('Oil & Gas', 'oil-gas', 'Oil and gas industry', 'fuel'),
('Medical', 'medical', 'Medical devices', 'heart-pulse'),
('Aerospace', 'aerospace', 'Aerospace components', 'plane'),
('Construction', 'construction', 'Building components', 'hard-hat'),
('Marine', 'marine', 'Marine components', 'anchor'),
('Telecommunications', 'telecommunications', 'Network hardware', 'antenna')
ON CONFLICT (slug) DO NOTHING;

-- Logistics Partners (fixed column names)
INSERT INTO logistics_partners (name, description, rating, is_intl, countries, services, estimated_days, price_min, price_max, status) VALUES
('DHL Express', 'Global express shipping', 4.8, true, ARRAY['US', 'UK', 'DE', 'FR', 'JP', 'AU', 'AE', 'IN'], ARRAY['Express', 'Door-to-Door'], 3, 25, 500, 'active'),
('FedEx', 'International logistics', 4.6, true, ARRAY['US', 'CA', 'MX', 'BR', 'UK', 'DE', 'CN'], ARRAY['Express', 'Freight'], 4, 30, 600, 'active'),
('Maersk', 'Container shipping', 4.5, true, ARRAY['US', 'CN', 'IN', 'SG', 'NL', 'DK'], ARRAY['Sea Freight'], 21, 500, 5000, 'active'),
('Blue Dart', 'India domestic', 4.3, false, ARRAY['IN'], ARRAY['Express', 'Surface'], 1, 5, 50, 'active'),
('DB Schenker', 'European logistics', 4.4, true, ARRAY['DE', 'FR', 'IT', 'ES', 'PL', 'NL'], ARRAY['Air', 'Ocean'], 5, 40, 800, 'active')
ON CONFLICT DO NOTHING;

-- CMS Pages
INSERT INTO cms_pages (slug, title, meta_title, meta_description) VALUES
('home', 'Home', 'SAVIMAN | Precision Manufacturing', 'Leading manufacturer of precision components.'),
('about', 'About Us', 'About Saviman Industries', 'Learn about Saviman since 1990.'),
('quality', 'Quality Assurance', 'Quality | Saviman', 'ISO 9001:2015 certified.'),
('infrastructure', 'Infrastructure', 'Our Infrastructure', 'Manufacturing facility.')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SUCCESS
-- =====================================================
SELECT 'Database created successfully!' as message;
