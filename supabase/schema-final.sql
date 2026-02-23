-- ============================================
-- SAVIMAN - Minimal New Tables
-- Run this in Supabase SQL Editor
-- ============================================

-- Check if tables exist and create only if they don't
DO $$ 
BEGIN
    -- Create leads table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'leads') THEN
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'ai_generated_leads') THEN
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'logistics_quotes') THEN
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'logistics_partners') THEN
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies
CREATE POLICY "Anyone can do anything with leads" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can do anything with ai_leads" ON ai_generated_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can do anything with logistics_quotes" ON logistics_quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can do anything with logistics_partners" ON logistics_partners FOR ALL USING (true) WITH CHECK (true);

-- Done!
SELECT 'Tables created successfully!' as message;
