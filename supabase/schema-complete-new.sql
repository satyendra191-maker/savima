-- ============================================
-- SAVIMAN COMPLETE SCHEMA - NEW TABLES
-- Creates NEW tables with "new_" prefix to avoid conflicts
-- ============================================

-- 1. NEW PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS new_products (
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
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. NEW INDUSTRIES TABLE
CREATE TABLE IF NOT EXISTS new_industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 3. NEW INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS new_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    product VARCHAR(255),
    message TEXT,
    attachment_url TEXT,
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'normal',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. LEADS TABLE
CREATE TABLE IF NOT EXISTS new_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    country_code VARCHAR(10),
    contact_number VARCHAR(50),
    email VARCHAR(255),
    requirement_description TEXT,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    converted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI LEADS TABLE
CREATE TABLE IF NOT EXISTS new_ai_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 6. LOGISTICS QUOTES TABLE
CREATE TABLE IF NOT EXISTS new_logistics_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255),
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

-- 7. NEW CATALOGS TABLE
CREATE TABLE IF NOT EXISTS new_catalogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 8. NEW CAREERS TABLE
CREATE TABLE IF NOT EXISTS new_careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 9. NEW DONATIONS TABLE
CREATE TABLE IF NOT EXISTS new_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 10. NEW BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS new_blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- 11. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS new_admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    name VARCHAR(100),
    permissions JSONB DEFAULT '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO new_admin_users (email, role, name, permissions) 
VALUES ('satyendra191@gmail.com', 'super_admin', 'Satyendra', '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true, "create": true, "delete": true, "update": true, "read": true}')
ON CONFLICT (email) DO NOTHING;

-- 12. LOGISTICS PARTNERS TABLE
CREATE TABLE IF NOT EXISTS new_logistics_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO new_logistics_partners (name, partner_type, description, website, coverage_countries, service_types, status, is_international, rating) VALUES
    ('DHL Express', 'international', 'Global leader in express shipping', 'https://www.dhl.com', ARRAY['USA', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Canada', 'UAE', 'India', 'China'], ARRAY['Express', 'Air Freight', 'Ocean Freight'], 'active', true, 4.8),
    ('FedEx', 'international', 'Global express shipping', 'https://www.fedex.com', ARRAY['USA', 'Canada', 'UK', 'Germany', 'Japan', 'China', 'India', 'Australia'], ARRAY['Express', 'Freight', 'Ground'], 'active', true, 4.7)
ON CONFLICT DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE new_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_ai_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_logistics_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_logistics_partners ENABLE ROW LEVEL SECURITY;

-- Products
CREATE POLICY "Public can view new_products" ON new_products FOR SELECT USING (true);
CREATE POLICY "Admin can manage new_products" ON new_products FOR ALL USING (true) WITH CHECK (true);

-- Industries
CREATE POLICY "Public can view new_industries" ON new_industries FOR SELECT USING (true);
CREATE POLICY "Admin can manage new_industries" ON new_industries FOR ALL USING (true) WITH CHECK (true);

-- Inquiries
CREATE POLICY "Public can create new_inquiries" ON new_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage new_inquiries" ON new_inquiries FOR ALL USING (true) WITH CHECK (true);

-- Leads
CREATE POLICY "Public can manage new_leads" ON new_leads FOR ALL USING (true) WITH CHECK (true);

-- AI Leads
CREATE POLICY "Public can manage new_ai_leads" ON new_ai_leads FOR ALL USING (true) WITH CHECK (true);

-- Logistics Quotes
CREATE POLICY "Public can manage new_logistics_quotes" ON new_logistics_quotes FOR ALL USING (true) WITH CHECK (true);

-- Catalogs
CREATE POLICY "Public can view new_catalogs" ON new_catalogs FOR SELECT USING (true);
CREATE POLICY "Admin can manage new_catalogs" ON new_catalogs FOR ALL USING (true) WITH CHECK (true);

-- Careers
CREATE POLICY "Public can view new_careers" ON new_careers FOR SELECT USING (true);
CREATE POLICY "Admin can manage new_careers" ON new_careers FOR ALL USING (true) WITH CHECK (true);

-- Donations
CREATE POLICY "Public can create new_donations" ON new_donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage new_donations" ON new_donations FOR ALL USING (true) WITH CHECK (true);

-- Blog Posts
CREATE POLICY "Public can view new_blog_posts" ON new_blog_posts FOR SELECT USING (true);
CREATE POLICY "Admin can manage new_blog_posts" ON new_blog_posts FOR ALL USING (true) WITH CHECK (true);

-- Admin Users
CREATE POLICY "Admin can manage new_admin_users" ON new_admin_users FOR ALL USING (true) WITH CHECK (true);

-- Logistics Partners
CREATE POLICY "Public can view new_logistics_partners" ON new_logistics_partners FOR SELECT USING (true);
CREATE POLICY "Admin can manage new_logistics_partners" ON new_logistics_partners FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_new_products_category ON new_products(category);
CREATE INDEX idx_new_products_slug ON new_products(slug);
CREATE INDEX idx_new_leads_status ON new_leads(status);
CREATE INDEX idx_new_leads_created ON new_leads(created_at DESC);
CREATE INDEX idx_new_ai_leads_status ON new_ai_leads(status);
CREATE INDEX idx_new_logistics_quotes_status ON new_logistics_quotes(status);
CREATE INDEX idx_new_logistics_quotes_created ON new_logistics_quotes(created_at DESC);
CREATE INDEX idx_new_inquiries_status ON new_inquiries(status);
CREATE INDEX idx_new_inquiries_created ON new_inquiries(created_at DESC);
CREATE INDEX idx_new_donations_status ON new_donations(payment_status);
CREATE INDEX idx_new_blog_posts_status ON new_blog_posts(status);
CREATE INDEX idx_new_careers_status ON new_careers(status);
CREATE INDEX idx_new_catalogs_status ON new_catalogs(status);

-- ============================================
-- DONE!
-- ============================================
SELECT '✅ All new tables created successfully!' as message;
