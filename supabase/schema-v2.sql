-- ============================================
-- SAVIMAN SCHEMA - Safe for existing databases
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMIN USERS TABLE
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

INSERT INTO admin_users (email, role, name, permissions) 
VALUES ('satyendra191@gmail.com', 'super_admin', 'Satyendra', '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true, "create": true, "delete": true, "update": true, "read": true}')
ON CONFLICT (email) DO NOTHING;

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
    price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_by UUID REFERENCES admin_users(id),
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
-- LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    country_code VARCHAR(10),
    contact_number VARCHAR(50),
    email VARCHAR(255),
    requirement_description TEXT,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(50) DEFAULT 'new',
    assigned_to UUID REFERENCES admin_users(id),
    notes TEXT,
    converted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AI GENERATED LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_generated_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100),
    person_name VARCHAR(255),
    company_name VARCHAR(255),
    country_code VARCHAR(10),
    contact_number VARCHAR(50),
    email VARCHAR(255),
    requirement_description TEXT,
    conversation_summary TEXT,
    buying_intent_score INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    is_partial BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LOGISTICS QUOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS logistics_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255),
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(10),
    delivery_address TEXT NOT NULL,
    weight DECIMAL(10, 2),
    dimensions VARCHAR(100),
    estimated_cost DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    logistic_partner VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CATALOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    thumbnail TEXT,
    pages INT DEFAULT 0,
    file_size VARCHAR(50),
    downloads INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    category VARCHAR(100),
    language VARCHAR(50) DEFAULT 'English',
    version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CAREERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    requirements TEXT,
    department VARCHAR(100),
    location VARCHAR(255),
    job_type VARCHAR(50) DEFAULT 'full-time',
    experience VARCHAR(100),
    salary_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DONATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255),
    donor_phone VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255) UNIQUE,
    message TEXT,
    anonymous BOOLEAN DEFAULT false,
    campaign VARCHAR(100),
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
-- LOGISTICS PARTNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS logistics_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    partner_type VARCHAR(100),
    description TEXT,
    logo_url TEXT,
    website VARCHAR(255),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    service_types TEXT[],
    coverage_countries TEXT[],
    rating DECIMAL(3, 2),
    status VARCHAR(50) DEFAULT 'active',
    is_international BOOLEAN DEFAULT false,
    contract_start DATE,
    contract_end DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default logistics partners
INSERT INTO logistics_partners (name, partner_type, description, website, coverage_countries, service_types, status, is_international, rating) VALUES
    ('DHL Express', 'international', 'Global leader in express shipping and logistics', 'https://www.dhl.com', ARRAY['USA', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Canada', 'UAE', 'Singapore', 'India', 'China', 'Brazil'], ARRAY['Express Delivery', 'Air Freight', 'Ocean Freight', 'Customs Clearance', 'Warehousing'], 'active', true, 4.8),
    ('FedEx', 'international', 'Worlds largest express transportation company', 'https://www.fedex.com', ARRAY['USA', 'Canada', 'Mexico', 'UK', 'Germany', 'France', 'Japan', 'China', 'India', 'Australia'], ARRAY['Express', 'Freight', 'Ground', 'International Priority', 'Customs Clearance'], 'active', true, 4.7)
ON CONFLICT DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;

-- Admin Users Policy
CREATE POLICY "Admins can view all admins" ON admin_users FOR SELECT USING (email = 'satyendra191@gmail.com');

-- Products Policies
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (email = 'satyendra191@gmail.com');

-- Industries Policies
CREATE POLICY "Public can view active industries" ON industries FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage industries" ON industries FOR ALL USING (email = 'satyendra191@gmail.com');

-- Inquiries Policies
CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view inquiries" ON inquiries FOR SELECT USING (email = 'satyendra191@gmail.com');
CREATE POLICY "Admins can update inquiries" ON inquiries FOR UPDATE USING (email = 'satyendra191@gmail.com');
CREATE POLICY "Admins can delete inquiries" ON inquiries FOR DELETE USING (email = 'satyendra191@gmail.com');

-- Leads Policies
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON leads FOR SELECT USING (email = 'satyendra191@gmail.com');
CREATE POLICY "Admins can update leads" ON leads FOR UPDATE USING (email = 'satyendra191@gmail.com');
CREATE POLICY "Admins can delete leads" ON leads FOR DELETE USING (email = 'satyendra191@gmail.com');

-- AI Generated Leads Policies
CREATE POLICY "Anyone can create ai leads" ON ai_generated_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view ai leads" ON ai_generated_leads FOR SELECT USING (email = 'satyendra191@gmail.com');
CREATE POLICY "Admins can update ai leads" ON ai_generated_leads FOR UPDATE USING (email = 'satyendra191@gmail.com');
CREATE POLICY "Admins can delete ai leads" ON ai_generated_leads FOR DELETE USING (email = 'satyendra191@gmail.com');

-- Logistics Quotes Policies
CREATE POLICY "Anyone can create logistics quotes" ON logistics_quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view logistics quotes" ON logistics_quotes FOR SELECT USING (email = 'satyendra191@gmail.com');
CREATE POLICY "Admins can update logistics quotes" ON logistics_quotes FOR UPDATE USING (email = 'satyendra191@gmail.com');
CREATE POLICY "Admins can delete logistics quotes" ON logistics_quotes FOR DELETE USING (email = 'satyendra191@gmail.com');

-- Catalogs Policies
CREATE POLICY "Public can view active catalogs" ON catalogs FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage catalogs" ON catalogs FOR ALL USING (email = 'satyendra191@gmail.com');

-- Careers Policies
CREATE POLICY "Public can view active careers" ON careers FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage careers" ON careers FOR ALL USING (email = 'satyendra191@gmail.com');

-- Donations Policies
CREATE POLICY "Anyone can create donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage donations" ON donations FOR ALL USING (email = 'satyendra191@gmail.com');

-- Blog Posts Policies
CREATE POLICY "Public can view published blogs" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage blogs" ON blog_posts FOR ALL USING (email = 'satyendra191@gmail.com');

-- Logistics Partners Policies
CREATE POLICY "Public can view active partners" ON logistics_partners FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage partners" ON logistics_partners FOR ALL USING (email = 'satyendra191@gmail.com');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_ai_leads_status ON ai_generated_leads(status);
CREATE INDEX idx_logistics_quotes_status ON logistics_quotes(status);
CREATE INDEX idx_logistics_quotes_created ON logistics_quotes(created_at DESC);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);

-- ============================================
-- DONE!
-- ============================================
