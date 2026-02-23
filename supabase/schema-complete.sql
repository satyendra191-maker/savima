-- ============================================
-- SAVIMAN COMPLETE DATABASE SCHEMA
-- Full schema with all tables and RLS policies
-- ============================================

-- ============================================
-- 1. ADMIN USERS
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'admin_users') THEN
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
    END IF;
END $$;

-- ============================================
-- 2. PRODUCTS
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
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
    END IF;
END $$;

-- ============================================
-- 3. INDUSTRIES
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'industries') THEN
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
    END IF;
END $$;

-- ============================================
-- 4. INQUIRIES
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'inquiries') THEN
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
    END IF;
END $$;

-- ============================================
-- 5. LEADS (Already created)
-- ============================================
-- Table should already exist from previous script

-- ============================================
-- 6. AI GENERATED LEADS (Already created)
-- ============================================
-- Table should already exist from previous script

-- ============================================
-- 7. LOGISTICS QUOTES (Already created)
-- ============================================
-- Table should already exist from previous script

-- ============================================
-- 8. CATALOGS
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'catalogs') THEN
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
    END IF;
END $$;

-- ============================================
-- 9. CAREERS
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'careers') THEN
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
    END IF;
END $$;

-- ============================================
-- 10. DONATIONS
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'donations') THEN
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
    END IF;
END $$;

-- ============================================
-- 11. BLOG POSTS
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'blog_posts') THEN
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
    END IF;
END $$;

-- ============================================
-- 12. SHIPMENTS
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'shipments') THEN
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
    END IF;
END $$;

-- ============================================
-- 13. CAREER APPLICATIONS
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'career_applications') THEN
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
    END IF;
END $$;

-- ============================================
-- LOGISTICS PARTNERS (Already created)
-- ============================================
-- Table should already exist from previous script

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
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
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and create new ones
DROP POLICY IF EXISTS "Anyone can do anything with leads" ON leads;
DROP POLICY IF EXISTS "Anyone can do anything with ai_leads" ON ai_generated_leads;
DROP POLICY IF EXISTS "Anyone can do anything with logistics_quotes" ON logistics_quotes;
DROP POLICY IF EXISTS "Anyone can do anything with logistics_partners" ON logistics_partners;

-- Admin Users
CREATE POLICY "Admin can manage admins" ON admin_users FOR ALL USING (true) WITH CHECK (true);

-- Products - Public can view active
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Industries
DROP POLICY IF EXISTS "Public can view industries" ON industries;
CREATE POLICY "Public can view active industries" ON industries FOR SELECT USING (status = 'active');
CREATE POLICY "Admin can manage industries" ON industries FOR ALL USING (true) WITH CHECK (true);

-- Inquiries
DROP POLICY IF EXISTS "Anyone can create inquiries" ON inquiries;
CREATE POLICY "Public can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

-- Leads
CREATE POLICY "Public can manage leads" ON leads FOR ALL USING (true) WITH CHECK (true);

-- AI Generated Leads
CREATE POLICY "Public can manage ai_leads" ON ai_generated_leads FOR ALL USING (true) WITH CHECK (true);

-- Logistics Quotes
CREATE POLICY "Public can manage logistics_quotes" ON logistics_quotes FOR ALL USING (true) WITH CHECK (true);

-- Catalogs
DROP POLICY IF EXISTS "Public can view catalogs" ON catalogs;
CREATE POLICY "Public can view active catalogs" ON catalogs FOR SELECT USING (status = 'active');
CREATE POLICY "Admin can manage catalogs" ON catalogs FOR ALL USING (true) WITH CHECK (true);

-- Careers
DROP POLICY IF EXISTS "Public can view careers" ON careers;
CREATE POLICY "Public can view active careers" ON careers FOR SELECT USING (status = 'active');
CREATE POLICY "Admin can manage careers" ON careers FOR ALL USING (true) WITH CHECK (true);

-- Donations
CREATE POLICY "Public can create donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage donations" ON donations FOR ALL USING (true) WITH CHECK (true);

-- Blog Posts
DROP POLICY IF EXISTS "Public can view blogs" ON blog_posts;
CREATE POLICY "Public can view published blogs" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admin can manage blogs" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

-- Shipments
CREATE POLICY "Public can track shipments" ON shipments FOR SELECT USING (true);
CREATE POLICY "Admin can manage shipments" ON shipments FOR ALL USING (true) WITH CHECK (true);

-- Career Applications
CREATE POLICY "Public can apply for jobs" ON career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage applications" ON career_applications FOR ALL USING (true) WITH CHECK (true);

-- Logistics Partners
CREATE POLICY "Public can view partners" ON logistics_partners FOR SELECT USING (true);
CREATE POLICY "Admin can manage partners" ON logistics_partners FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_leads_status ON ai_generated_leads(status);
CREATE INDEX IF NOT EXISTS idx_logistics_quotes_status ON logistics_quotes(status);
CREATE INDEX IF NOT EXISTS idx_logistics_quotes_created ON logistics_quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(shipment_status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_careers_status ON careers(status);
CREATE INDEX IF NOT EXISTS idx_catalogs_status ON catalogs(status);

-- ============================================
-- COMPLETE!
-- ============================================
SELECT '✅ Database schema created successfully!' as message;
