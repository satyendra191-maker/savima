-- ============================================
-- STEP 2: CREATE ALL TABLES - FRESH START
-- ============================================

-- 1. ADMIN USERS
CREATE TABLE admin_users (
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

INSERT INTO admin_users (email, role, name, permissions) 
VALUES ('satyendra191@gmail.com', 'super_admin', 'Satyendra', '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true, "create": true, "delete": true, "update": true, "read": true}')
ON CONFLICT (email) DO NOTHING;

-- 2. PRODUCTS
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
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INDUSTRIES
CREATE TABLE industries (
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

-- 4. INQUIRIES
CREATE TABLE inquiries (
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

-- 5. LEADS
CREATE TABLE leads (
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

-- 6. AI GENERATED LEADS
CREATE TABLE ai_generated_leads (
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

-- 7. LOGISTICS QUOTES
CREATE TABLE logistics_quotes (
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

-- 8. CATALOGS
CREATE TABLE catalogs (
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

-- 9. CAREERS
CREATE TABLE careers (
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

-- 10. CAREER APPLICATIONS
CREATE TABLE career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume_url TEXT,
    cover_letter TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    rating INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. DONATIONS
CREATE TABLE donations (
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

-- 12. BLOG POSTS
CREATE TABLE blog_posts (
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

-- 13. SHIPMENTS
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100),
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    shipping_address TEXT,
    product_details TEXT,
    weight DECIMAL(10, 2),
    dimensions VARCHAR(100),
    logistic_partner VARCHAR(100),
    carrier VARCHAR(100),
    shipment_status VARCHAR(50) DEFAULT 'pending',
    current_location TEXT,
    origin_location TEXT,
    destination_country VARCHAR(100),
    tracking_updates JSONB DEFAULT '[]',
    estimated_delivery DATE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. LOGISTICS PARTNERS
CREATE TABLE logistics_partners (
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

INSERT INTO logistics_partners (name, partner_type, description, website, coverage_countries, service_types, status, is_international, rating) VALUES
    ('DHL Express', 'international', 'Global leader in express shipping', 'https://www.dhl.com', ARRAY['USA', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Canada', 'UAE', 'India', 'China'], ARRAY['Express', 'Air Freight', 'Ocean Freight'], 'active', true, 4.8),
    ('FedEx', 'international', 'Global express shipping company', 'https://www.fedex.com', ARRAY['USA', 'Canada', 'UK', 'Germany', 'Japan', 'China', 'India', 'Australia'], ARRAY['Express', 'Freight', 'Ground'], 'active', true, 4.7)
ON CONFLICT DO NOTHING;

-- 15. SITE SETTINGS
CREATE TABLE site_settings (
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
VALUES (1, 'Saviman Industries', 'Precision Manufacturing Excellence', 'export@saviman.com', '© 2024 Saviman Industries. All rights reserved.')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 3: ENABLE RLS
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
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: RLS POLICIES
-- ============================================

-- Admin Users
CREATE POLICY "Admin can manage admins" ON admin_users FOR ALL USING (true) WITH CHECK (true);

-- Products
CREATE POLICY "Public can view products" ON products FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Industries
CREATE POLICY "Public can view industries" ON industries FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage industries" ON industries FOR ALL USING (true) WITH CHECK (true);

-- Inquiries
CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

-- Leads
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage leads" ON leads FOR ALL USING (true) WITH CHECK (true);

-- AI Generated Leads
CREATE POLICY "Anyone can create ai leads" ON ai_generated_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage ai leads" ON ai_generated_leads FOR ALL USING (true) WITH CHECK (true);

-- Logistics Quotes
CREATE POLICY "Anyone can create logistics quotes" ON logistics_quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage logistics quotes" ON logistics_quotes FOR ALL USING (true) WITH CHECK (true);

-- Catalogs
CREATE POLICY "Public can view catalogs" ON catalogs FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage catalogs" ON catalogs FOR ALL USING (true) WITH CHECK (true);

-- Careers
CREATE POLICY "Public can view careers" ON careers FOR SELECT USING (status = 'active' OR status IS NULL);
CREATE POLICY "Admin can manage careers" ON careers FOR ALL USING (true) WITH CHECK (true);

-- Career Applications
CREATE POLICY "Anyone can apply for jobs" ON career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage applications" ON career_applications FOR ALL USING (true) WITH CHECK (true);

-- Donations
CREATE POLICY "Anyone can create donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage donations" ON donations FOR ALL USING (true) WITH CHECK (true);

-- Blog Posts
CREATE POLICY "Public can view blogs" ON blog_posts FOR SELECT USING (status = 'published' OR status IS NULL);
CREATE POLICY "Admin can manage blogs" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

-- Shipments
CREATE POLICY "Public can track shipments" ON shipments FOR SELECT USING (true);
CREATE POLICY "Admin can manage shipments" ON shipments FOR ALL USING (true) WITH CHECK (true);

-- Logistics Partners
CREATE POLICY "Public can view partners" ON logistics_partners FOR SELECT USING (true);
CREATE POLICY "Admin can manage partners" ON logistics_partners FOR ALL USING (true) WITH CHECK (true);

-- Site Settings
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- STEP 5: INDEXES
-- ============================================

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_industries_slug ON industries(slug);
CREATE INDEX idx_industries_status ON industries(status);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_ai_leads_status ON ai_generated_leads(status);
CREATE INDEX idx_logistics_quotes_status ON logistics_quotes(status);
CREATE INDEX idx_logistics_quotes_created ON logistics_quotes(created_at DESC);
CREATE INDEX idx_catalogs_status ON catalogs(status);
CREATE INDEX idx_careers_status ON careers(status);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_shipments_status ON shipments(shipment_status);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);

-- ============================================
-- DONE!
-- ============================================

SELECT '✅ COMPLETE! Database schema created successfully!' as message;
