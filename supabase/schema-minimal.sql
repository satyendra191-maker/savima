-- ============================================
-- SAVIMAN NEW TABLES ONLY
-- Run this in Supabase SQL Editor
-- This adds ONLY new tables, won't affect existing data
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LEADS TABLE (New)
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
    assigned_to UUID,
    notes TEXT,
    converted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AI GENERATED LEADS TABLE (New)
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
-- LOGISTICS QUOTES TABLE (New)
-- ============================================
CREATE TABLE IF NOT EXISTS logistics_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID,
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
-- Add missing columns to existing tables if needed
-- ============================================

-- Add columns to site_settings if they don't exist
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS tagline VARCHAR(255);
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false;

-- Add columns to products if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- Add columns to industries if they don't exist
ALTER TABLE industries ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
ALTER TABLE industries ADD COLUMN IF NOT EXISTS product_count INT DEFAULT 0;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;

-- Leads Policies
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON leads FOR SELECT USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));
CREATE POLICY "Admins can update leads" ON leads FOR UPDATE USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));
CREATE POLICY "Admins can delete leads" ON leads FOR DELETE USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));

-- AI Generated Leads Policies
CREATE POLICY "AI can create leads" ON ai_generated_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view ai leads" ON ai_generated_leads FOR SELECT USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));
CREATE POLICY "Admins can update ai leads" ON ai_generated_leads FOR UPDATE USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));
CREATE POLICY "Admins can delete ai leads" ON ai_generated_leads FOR DELETE USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));

-- Logistics Quotes Policies
CREATE POLICY "Anyone can create logistics quotes" ON logistics_quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view logistics quotes" ON logistics_quotes FOR SELECT USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));
CREATE POLICY "Admins can update logistics quotes" ON logistics_quotes FOR UPDATE USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));
CREATE POLICY "Admins can delete logistics quotes" ON logistics_quotes FOR DELETE USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));

-- Site Settings Policies
DROP POLICY IF EXISTS "Public can view settings" ON site_settings;
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON site_settings;
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));

-- Products Policies
DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));

-- Industries Policies
DROP POLICY IF EXISTS "Public can view active industries" ON industries;
CREATE POLICY "Public can view active industries" ON industries FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage industries" ON industries;
CREATE POLICY "Admins can manage industries" ON industries FOR ALL USING (auth.jwt() ->> 'email' = 'satyendra191@gmail.com' OR EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt() ->> 'email'));

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_leads_status ON ai_generated_leads(status);
CREATE INDEX IF NOT EXISTS idx_logistics_quotes_status ON logistics_quotes(status);
CREATE INDEX IF NOT EXISTS idx_logistics_quotes_created ON logistics_quotes(created_at DESC);

-- ============================================
-- DONE!
-- ============================================
