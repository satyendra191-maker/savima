-- =====================================================
-- MINIMAL SAVIMAN DATABASE - JUST ESSENTIAL TABLES
-- =====================================================

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DROP EXISTING
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

-- 1. PRODUCTS
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
    specifications JSONB DEFAULT '{}',
    brochure_url TEXT,
    images TEXT[],
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INQUIRIES (Contact Form)
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    product TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEADS
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company_name TEXT,
    requirement_description TEXT,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'new',
    converted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AI GENERATED LEADS (Chat Widget)
CREATE TABLE ai_generated_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT,
    person_name TEXT,
    company_name TEXT,
    contact_number TEXT,
    email TEXT,
    requirement_description TEXT,
    conversation_summary TEXT,
    buying_intent_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    is_partial BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SITE SETTINGS
CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'Saviman Industries',
    contact_email TEXT DEFAULT 'export@saviman.com',
    contact_phone TEXT DEFAULT '+91 95069 43134',
    address TEXT DEFAULT 'Jamnagar, Gujarat',
    footer_text TEXT DEFAULT '2024 Saviman',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 6. CMS PAGES
CREATE TABLE cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    sections JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDUSTRIES
CREATE TABLE industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BLOG POSTS
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    author TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CAREER APPLICATIONS
CREATE TABLE career_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DONATIONS
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
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. LOGISTICS PARTNERS (FIXED - no is_international)
CREATE TABLE logistics_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    is_intl BOOLEAN DEFAULT FALSE,
    countries TEXT[],
    services TEXT[],
    estimated_days INTEGER,
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. LOGISTICS QUOTES
CREATE TABLE logistics_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name TEXT,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT NOT NULL,
    delivery_address TEXT,
    weight DECIMAL(10,2),
    estimated_cost DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    logistic_partner TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending',
    items JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SHIPMENTS
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID,
    tracking_number TEXT UNIQUE,
    carrier TEXT NOT NULL,
    current_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RLS - Secure Role-Based Access Control
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
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Public read, admin write
CREATE POLICY "p_products_read" ON products FOR SELECT USING (TRUE);
CREATE POLICY "p_products_admin" ON products FOR ALL USING (is_admin());

-- INQUIRIES: Public insert only, admin full access
CREATE POLICY "p_inquiries_insert" ON inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "p_inquiries_admin" ON inquiries FOR ALL USING (is_admin());

-- LEADS: Public insert only, admin full access
CREATE POLICY "p_leads_insert" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "p_leads_admin" ON leads FOR ALL USING (is_admin());

-- AI GENERATED LEADS: Public insert only, admin full access
CREATE POLICY "p_ai_leads_insert" ON ai_generated_leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "p_ai_leads_admin" ON ai_generated_leads FOR ALL USING (is_admin());

-- SITE SETTINGS: Public read, admin write
CREATE POLICY "p_settings_read" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "p_settings_admin" ON site_settings FOR ALL USING (is_admin());

-- CMS PAGES: Public read, admin write
CREATE POLICY "p_cms_read" ON cms_pages FOR SELECT USING (TRUE);
CREATE POLICY "p_cms_admin" ON cms_pages FOR ALL USING (is_admin());

-- INDUSTRIES: Public read, admin write
CREATE POLICY "p_industries_read" ON industries FOR SELECT USING (TRUE);
CREATE POLICY "p_industries_admin" ON industries FOR ALL USING (is_admin());

-- BLOG POSTS: Public read published, admin full access
CREATE POLICY "p_blog_read" ON blog_posts FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "p_blog_admin" ON blog_posts FOR ALL USING (is_admin());

-- CAREER APPLICATIONS: Public insert only, admin full access
CREATE POLICY "p_careers_insert" ON career_applications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "p_careers_admin" ON career_applications FOR ALL USING (is_admin());

-- DONATIONS: Public insert only, admin full access
CREATE POLICY "p_donations_insert" ON donations FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "p_donations_admin" ON donations FOR ALL USING (is_admin());

-- LOGISTICS PARTNERS: Public read, admin write
CREATE POLICY "p_logistics_read" ON logistics_partners FOR SELECT USING (TRUE);
CREATE POLICY "p_logistics_admin" ON logistics_partners FOR ALL USING (is_admin());

-- LOGISTICS QUOTES: Public insert only, admin full access
CREATE POLICY "p_logistics_quotes_insert" ON logistics_quotes FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "p_logistics_quotes_admin" ON logistics_quotes FOR ALL USING (is_admin());

-- ORDERS: Public insert only, admin full access
CREATE POLICY "p_orders_insert" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "p_orders_admin" ON orders FOR ALL USING (is_admin());

-- SHIPMENTS: Admin only (sensitive logistics data)
CREATE POLICY "p_shipments_admin" ON shipments FOR ALL USING (is_admin());

-- =====================================================
-- SEED DATA
-- =====================================================
INSERT INTO products (name, slug, category, short_description, image_url, status) VALUES
('Brass Knurled Insert', 'brass-insert', 'brass', 'Precision brass inserts', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 'active'),
('CNC Turned Part', 'cnc-turned', 'precision', 'CNC precision parts', 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=600', 'active'),
('SS Hex Bolt', 'ss-bolt', 'steel', 'Stainless steel bolts', 'https://images.unsplash.com/photo-16297316323ec-449301934960?w=600', 'active'),
('Hydraulic Fitting', 'hydraulic-fit', 'hydraulic', 'Hydraulic fittings', 'https://images.unsplash.com/photo-1504917595217-d4dc5f649776?w=600', 'active')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO industries (name, slug, description, icon) VALUES
('Automotive', 'automotive', 'Auto components', 'car'),
('Electronics', 'electronics', 'Electronic parts', 'cpu'),
('Oil & Gas', 'oil-gas', 'Oil & gas industry', 'fuel'),
('Medical', 'medical', 'Medical devices', 'heart'),
('Aerospace', 'aerospace', 'Aerospace parts', 'plane')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO logistics_partners (name, description, rating, is_intl, countries, services, estimated_days, price_min, price_max, status) VALUES
('DHL Express', 'Global shipping', 4.8, true, ARRAY['US','UK','DE','FR','JP','IN'], ARRAY['Express','Door-to-Door'], 3, 25, 500, 'active'),
('FedEx', 'International', 4.6, true, ARRAY['US','CA','UK','DE','CN'], ARRAY['Express','Freight'], 4, 30, 600, 'active'),
('Blue Dart', 'India domestic', 4.3, false, ARRAY['IN'], ARRAY['Express'], 1, 5, 50, 'active')
ON CONFLICT DO NOTHING;

INSERT INTO cms_pages (slug, title, meta_title, meta_description) VALUES
('home', 'Home', 'SAVIMAN | Precision Manufacturing', 'Leading manufacturer.'),
('about', 'About Us', 'About Saviman', 'Since 1990.')
ON CONFLICT (slug) DO NOTHING;

SELECT 'SUCCESS: Database created!' as result;
