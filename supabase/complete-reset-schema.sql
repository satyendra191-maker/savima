-- ============================================
-- ANTIGRAVIT OPENCODE - COMPLETE WORKING SCHEMA
-- All in one file - Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop existing tables (if any)
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS visitor_sessions CASCADE;
DROP TABLE IF EXISTS ai_generated_leads CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS rfqs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_tracking CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS logistics_partners CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS catalogs CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS cms_pages CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Create all tables

-- ADMIN USERS
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    name VARCHAR(100),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_description TEXT,
    long_description TEXT,
    industry_usage TEXT,
    technical_highlights TEXT[],
    image_url TEXT,
    price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDUSTRIES
CREATE TABLE industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEADS
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    source_page TEXT,
    session_id TEXT,
    status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'normal',
    notes TEXT,
    buying_intent_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISITOR SESSIONS
CREATE TABLE visitor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    visited_pages TEXT[],
    referrer TEXT,
    utm_source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI GENERATED LEADS
CREATE TABLE ai_generated_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100),
    person_name VARCHAR(255),
    company_name VARCHAR(255),
    email VARCHAR(255),
    requirement_description TEXT,
    conversation_summary TEXT,
    buying_intent_score INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INQUIRIES
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    product VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RFQS
CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    items JSONB DEFAULT '[]',
    specifications TEXT,
    quantity INTEGER,
    status VARCHAR(50) DEFAULT 'new',
    quoted_price DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_serial BIGINT GENERATED ALWAYS AS IDENTITY,
    transaction_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    items JSONB DEFAULT '[]',
    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_gateway TEXT,
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'Order Confirmed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER TRACKING
CREATE TABLE order_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DONATIONS
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_serial BIGINT GENERATED ALWAYS AS IDENTITY,
    transaction_id TEXT UNIQUE NOT NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_status VARCHAR(50) DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENT TRANSACTIONS
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    gateway VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    department VARCHAR(100),
    location VARCHAR(255),
    job_type VARCHAR(50) DEFAULT 'full-time',
    experience VARCHAR(100),
    salary_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOB APPLICATIONS
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    cv_url TEXT,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SHIPMENTS
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address TEXT,
    shipment_status VARCHAR(50) DEFAULT 'pending',
    current_location TEXT,
    logistic_partner VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LOGISTICS PARTNERS
CREATE TABLE logistics_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    partner_type VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    rating DECIMAL(3, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOG POSTS
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100),
    featured_image TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATALOGS
CREATE TABLE catalogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS
CREATE TABLE site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    footer_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS PAGES
CREATE TABLE cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANALYTICS EVENTS
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    session_id VARCHAR(100),
    page_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Auto-generate IDs
CREATE OR REPLACE FUNCTION generate_order_txn()
RETURNS TRIGGER AS $$
BEGIN
    NEW.transaction_id := 'ORD-' || LPAD(NEW.order_serial::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_txn_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_txn();

CREATE OR REPLACE FUNCTION generate_donation_txn()
RETURNS TRIGGER AS $$
BEGIN
    NEW.transaction_id := 'DON-' || LPAD(NEW.donation_serial::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER donation_txn_trigger BEFORE INSERT ON donations FOR EACH ROW EXECUTE FUNCTION generate_donation_txn();

CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tracking_number := 'SAV-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tracking_number_trigger BEFORE INSERT ON shipments FOR EACH ROW EXECUTE FUNCTION generate_tracking_number();

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON industries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_logistics_partners_updated_at BEFORE UPDATE ON logistics_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_catalogs_updated_at BEFORE UPDATE ON catalogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_orders_transaction ON orders(transaction_id);
CREATE INDEX idx_donations_transaction ON donations(transaction_id);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);

-- Step 5: Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Step 6: RLS Policies
CREATE OR REPLACE FUNCTION is_admin_request()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN current_setting('request.headers', true)::jsonb->>'x-admin-key' = 'saviman_admin_2024';
EXCEPTION WHEN OTHERS THEN RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read policies
CREATE POLICY "pub_products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "pub_industries" ON industries FOR SELECT USING (status = 'active');
CREATE POLICY "pub_blogs" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "pub_catalogs" ON catalogs FOR SELECT USING (status = 'active');
CREATE POLICY "pub_jobs" ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "pub_logistics" ON logistics_partners FOR SELECT USING (status = 'active');
CREATE POLICY "pub_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "pub_cms" ON cms_pages FOR SELECT USING (status = 'published');

-- Public insert policies
CREATE POLICY "pub_leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_orders" ON orders FOR SELECT USING (true);
CREATE POLICY "pub_shipments" ON shipments FOR SELECT USING (true);
CREATE POLICY "pub_donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_applications" ON job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_visitor" ON visitor_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_analytics" ON analytics_events FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "admin_admin_users" ON admin_users FOR ALL USING (is_admin_request());
CREATE POLICY "admin_products" ON products FOR ALL USING (is_admin_request());
CREATE POLICY "admin_industries" ON industries FOR ALL USING (is_admin_request());
CREATE POLICY "admin_leads" ON leads FOR ALL USING (is_admin_request());
CREATE POLICY "admin_visitor_sessions" ON visitor_sessions FOR ALL USING (is_admin_request());
CREATE POLICY "admin_inquiries" ON inquiries FOR ALL USING (is_admin_request());
CREATE POLICY "admin_orders" ON orders FOR ALL USING (is_admin_request());
CREATE POLICY "admin_donations" ON donations FOR ALL USING (is_admin_request());
CREATE POLICY "admin_jobs" ON jobs FOR ALL USING (is_admin_request());
CREATE POLICY "admin_job_applications" ON job_applications FOR ALL USING (is_admin_request());
CREATE POLICY "admin_shipments" ON shipments FOR ALL USING (is_admin_request());
CREATE POLICY "admin_logistics_partners" ON logistics_partners FOR ALL USING (is_admin_request());
CREATE POLICY "admin_blog_posts" ON blog_posts FOR ALL USING (is_admin_request());
CREATE POLICY "admin_catalogs" ON catalogs FOR ALL USING (is_admin_request());
CREATE POLICY "admin_site_settings" ON site_settings FOR ALL USING (is_admin_request());
CREATE POLICY "admin_cms_pages" ON cms_pages FOR ALL USING (is_admin_request());
CREATE POLICY "admin_analytics_events" ON analytics_events FOR ALL USING (is_admin_request());
CREATE POLICY "admin_audit_logs" ON audit_logs FOR ALL USING (is_admin_request());

-- Step 7: Seed Data
INSERT INTO admin_users (email, role, name, permissions) 
VALUES ('satyendra191@gmail.com', 'super_admin', 'Satyendra', '{"products": true, "inquiries": true, "orders": true, "donations": true}')
ON CONFLICT (email) DO NOTHING;

INSERT INTO site_settings (id, site_name, contact_email, contact_phone, footer_text)
VALUES (1, 'Antigravit OpenCode', 'satyendra191@gmail.com', '+91 98765 43210', 'Designed by SaviTech')
ON CONFLICT (id) DO NOTHING;

INSERT INTO logistics_partners (name, partner_type, description, status, rating) VALUES
('DHL Express', 'international', 'Global shipping', 'active', 4.8),
('FedEx', 'international', 'Express delivery', 'active', 4.7),
('Indian Post', 'domestic', 'India Post', 'active', 4.0)
ON CONFLICT DO NOTHING;

INSERT INTO industries (name, slug, description, status, featured) VALUES
('Electronics', 'electronics', 'Electronics components', 'active', true),
('Automotive', 'automotive', 'Automotive parts', 'active', true),
('Plumbing', 'plumbing', 'Plumbing solutions', 'active', false),
('Aerospace', 'aerospace', 'Aerospace components', 'active', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, category, short_description, price, status, featured) VALUES
('Brass Knurled Inserts', 'brass-knurled-inserts', 'brass', 'Precision brass inserts', 0.50, 'active', true),
('SS Hydraulic Fittings', 'ss-hydraulic-fittings', 'steel', 'SS 316L fittings', 12.50, 'active', true),
('SS Anchor Bolts', 'ss-anchor-bolts', 'steel', 'SS 304 bolts', 2.25, 'active', false),
('CNC Aerospace Parts', 'cnc-aerospace-parts', 'other', 'Precision CNC', 45.00, 'active', true)
ON CONFLICT (slug) DO NOTHING;

-- Step 8: Reload
NOTIFY pgrst, 'reload schema';

SELECT 'COMPLETE SCHEMA CREATED' as status;
