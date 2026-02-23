-- ============================================
-- SAVIMAN - NEW TABLES ONLY
-- Creates ONLY new tables, uses existing tables as-is
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- NEW TABLES (These will be created fresh)
-- ============================================

-- LEADS TABLE
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
    assigned_to VARCHAR(255),
    notes TEXT,
    converted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI GENERATED LEADS TABLE
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

-- LOGISTICS QUOTES TABLE
CREATE TABLE IF NOT EXISTS logistics_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- LOGISTICS PARTNERS TABLE
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
    ('DHL Express', 'international', 'Global leader in express shipping', 'https://www.dhl.com', ARRAY['USA', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Canada', 'UAE', 'India', 'China'], ARRAY['Express', 'Air Freight', 'Ocean Freight'], 'active', true, 4.8),
    ('FedEx', 'international', 'Global express shipping', 'https://www.fedex.com', ARRAY['USA', 'Canada', 'UK', 'Germany', 'Japan', 'China', 'India', 'Australia'], ARRAY['Express', 'Freight', 'Ground'], 'active', true, 4.7)
ON CONFLICT DO NOTHING;

-- ============================================
-- RLS POLICIES (For new tables only)
-- ============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;

-- Leads Policies
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Public can update leads" ON leads FOR UPDATE USING (true);
CREATE POLICY "Public can delete leads" ON leads FOR DELETE USING (true);

-- AI Generated Leads Policies  
CREATE POLICY "Anyone can create ai leads" ON ai_generated_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view ai leads" ON ai_generated_leads FOR SELECT USING (true);
CREATE POLICY "Public can update ai leads" ON ai_generated_leads FOR UPDATE USING (true);
CREATE POLICY "Public can delete ai leads" ON ai_generated_leads FOR DELETE USING (true);

-- Logistics Quotes Policies
CREATE POLICY "Anyone can create logistics quotes" ON logistics_quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view logistics quotes" ON logistics_quotes FOR SELECT USING (true);
CREATE POLICY "Public can update logistics quotes" ON logistics_quotes FOR UPDATE USING (true);
CREATE POLICY "Public can delete logistics quotes" ON logistics_quotes FOR DELETE USING (true);

-- Logistics Partners Policies
CREATE POLICY "Public can view active partners" ON logistics_partners FOR SELECT USING (true);
CREATE POLICY "Public can manage partners" ON logistics_partners FOR ALL USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_ai_leads_status ON ai_generated_leads(status);
CREATE INDEX idx_logistics_quotes_status ON logistics_quotes(status);
CREATE INDEX idx_logistics_quotes_created ON logistics_quotes(created_at DESC);

-- ============================================
-- DONE!
-- ============================================
