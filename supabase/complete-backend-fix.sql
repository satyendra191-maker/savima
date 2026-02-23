-- ============================================
-- COMPREHENSIVE BACKEND FIX - Add all missing columns
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PRODUCTS TABLE - Add missing columns
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS model_name VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS version VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brochure_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];

-- ============================================
-- 2. INQUIRIES TABLE - Add missing columns
-- ============================================

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- 3. INDUSTRIES TABLE - Add missing columns
-- ============================================

ALTER TABLE industries ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
ALTER TABLE industries ADD COLUMN IF NOT EXISTS product_count INT DEFAULT 0;
ALTER TABLE industries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE industries ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE industries ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE industries ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- ============================================
-- 4. BLOG_POSTS TABLE - Add missing columns
-- ============================================

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author VARCHAR(100);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- ============================================
-- 5. CATALOGS TABLE - Add missing columns
-- ============================================

ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS thumbnail TEXT;
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS pages INT DEFAULT 0;
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS file_size VARCHAR(50);
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS downloads INT DEFAULT 0;
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English';
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS version VARCHAR(50);

-- ============================================
-- 6. CAREERS TABLE - Add missing columns
-- ============================================

ALTER TABLE careers ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS requirements TEXT;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE careers ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE careers ADD COLUMN IF NOT EXISTS job_type VARCHAR(50) DEFAULT 'full-time';
ALTER TABLE careers ADD COLUMN IF NOT EXISTS experience VARCHAR(100);
ALTER TABLE careers ADD COLUMN IF NOT EXISTS salary_range VARCHAR(100);
ALTER TABLE careers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE careers ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS posted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- ============================================
-- 7. CAREER_APPLICATIONS TABLE - Add missing columns
-- ============================================

ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS cover_letter TEXT;
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS rating INT DEFAULT 0;

-- ============================================
-- 8. DONATIONS TABLE - Add missing columns
-- ============================================

ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_phone VARCHAR(50);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255) UNIQUE;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS anonymous BOOLEAN DEFAULT false;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS campaign VARCHAR(100);

-- ============================================
-- 9. SHIPMENTS TABLE - Add missing columns
-- ============================================

ALTER TABLE shipments ADD COLUMN IF NOT EXISTS order_id VARCHAR(100);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS product_details TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS logistic_partner VARCHAR(100);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS carrier VARCHAR(100);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS current_location TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS origin_location TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS destination_country VARCHAR(100);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS tracking_updates JSONB DEFAULT '[]';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS estimated_delivery DATE;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- ============================================
-- 10. LOGISTICS_PARTNERS TABLE - Add missing columns
-- ============================================

ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS partner_type VARCHAR(100);
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS service_types TEXT[];
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS coverage_countries TEXT[];
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2);
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS contract_start DATE;
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS contract_end DATE;
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS is_international BOOLEAN DEFAULT false;
ALTER TABLE logistics_partners ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- 11. LEADS TABLE - Add missing columns
-- ============================================

ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'website';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS converted BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- 12. AI_GENERATED_LEADS TABLE - Add missing columns
-- ============================================

ALTER TABLE ai_generated_leads ADD COLUMN IF NOT EXISTS conversation_summary TEXT;
ALTER TABLE ai_generated_leads ADD COLUMN IF NOT EXISTS buying_intent_score INT DEFAULT 0;
ALTER TABLE ai_generated_leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE ai_generated_leads ADD COLUMN IF NOT EXISTS is_partial BOOLEAN DEFAULT false;
ALTER TABLE ai_generated_leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- 13. LOGISTICS_QUOTES TABLE - Add missing columns
-- ============================================

ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS country_code VARCHAR(10);
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2);
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100);
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS estimated_cost DECIMAL(10, 2);
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD';
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS logistic_partner VARCHAR(100);
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE logistics_quotes ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- 14. CMS_PAGES TABLE - Add missing columns
-- ============================================

ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]';
ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS template VARCHAR(50) DEFAULT 'default';

-- ============================================
-- 15. SITE_SETTINGS TABLE - Create if not exists
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'site_settings') THEN
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
        VALUES (1, 'Saviman Industries', 'Precision Manufacturing Excellence', 'export@saviman.com', '© ' || EXTRACT(YEAR FROM NOW()) || ' Saviman Industries. All rights reserved.')
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- ============================================
-- 16. ANALYTICS_EVENTS TABLE - Create if not exists
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'analytics_events') THEN
        CREATE TABLE analytics_events (
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
    END IF;
END $$;

-- ============================================
-- 17. ADMIN_USERS TABLE - Create if not exists
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'admin_users') THEN
        CREATE TABLE admin_users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'admin',
            name VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE
        );
    END IF;
END $$;

-- ============================================
-- 18. Enable RLS on new tables
-- ============================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
DROP POLICY IF EXISTS "Public can read site_settings" ON site_settings;
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin can manage site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for analytics_events
DROP POLICY IF EXISTS "Anyone can create analytics" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create analytics" ON analytics_events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin can view analytics" ON analytics_events FOR SELECT USING (true);

-- RLS Policies for admin_users
DROP POLICY IF EXISTS "Admin can manage admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- DONE!
-- ============================================

SELECT '✅ All backend columns and tables created successfully!' as message;
