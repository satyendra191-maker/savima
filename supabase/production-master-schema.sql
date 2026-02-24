-- ============================================
-- ANTIGRAVIT OPENCODE - ENTERPRISE PRODUCTION MASTER SCHEMA
-- Complete SaaS Platform with RBAC, RLS, Payments, Tracking, Analytics
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: EXTENSIONS
-- ============================================
DO $$ BEGIN
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- STEP 2: CORE TABLES - PROFILES & RBAC
-- ============================================

-- Profiles (extends auth.users with role-based access)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'finance_admin', 'hr_admin', 'user', 'anon')),
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users Table (for CMS access)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'finance_admin', 'hr_admin')),
    name VARCHAR(100),
    permissions JSONB DEFAULT '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default super admin
INSERT INTO public.admin_users (email, role, name, permissions) 
VALUES ('satyendra191@gmail.com', 'super_admin', 'Satyendra', 
    '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true, "create": true, "delete": true, "update": true, "read": true, "orders": true, "donations": true, "shipments": true}')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- STEP 3: LEADS & VISITOR TRACKING
-- ============================================

-- Leads table (AI Engineer / Contact / Inquiry)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    country_code TEXT,
    message TEXT,
    material_details TEXT,
    file_url TEXT,
    source_page TEXT,
    session_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'quoted', 'won', 'lost')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to UUID REFERENCES public.profiles(id),
    notes TEXT,
    buying_intent_score INT DEFAULT 0,
    converted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor Sessions (Cookie-based tracking)
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    visitor_id TEXT,
    visited_pages TEXT[],
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    first_visit_at TIMESTAMPTZ DEFAULT NOW(),
    last_visit_at TIMESTAMPTZ DEFAULT NOW(),
    visit_count INT DEFAULT 1,
    cookies_consented BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Generated Leads
CREATE TABLE IF NOT EXISTS public.ai_generated_leads (
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 4: PRODUCTS & INVENTORY
-- ============================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_description TEXT,
    long_description TEXT,
    industry_usage TEXT,
    technical_highlights TEXT[],
    image_url TEXT,
    gallery_urls TEXT[],
    price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued', 'out_of_stock')),
    featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Industries
CREATE TABLE IF NOT EXISTS public.industries (
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 5: ORDERS & PAYMENTS
-- ============================================

-- Orders (Business Procurement)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_serial BIGINT GENERATED ALWAYS AS IDENTITY,
    transaction_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    customer_name TEXT NOT NULL,
    customer_company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    billing_address TEXT,
    shipping_address TEXT,
    items JSONB DEFAULT '[]',
    subtotal DECIMAL(12, 2),
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    shipping_cost DECIMAL(12, 2) DEFAULT 0,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_gateway TEXT,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    order_status TEXT DEFAULT 'Order Confirmed' CHECK (order_status IN ('Order Confirmed', 'Processing', 'Manufacturing', 'Quality Check', 'Dispatched', 'Delivered', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Tracking
CREATE TABLE IF NOT EXISTS public.order_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT,
    description TEXT,
    estimated_date DATE,
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_serial BIGINT GENERATED ALWAYS AS IDENTITY,
    transaction_id TEXT UNIQUE NOT NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT,
    donor_phone TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_gateway TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    message TEXT,
    anonymous BOOLEAN DEFAULT false,
    campaign VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Transactions (for all payment gateways)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id TEXT UNIQUE NOT NULL,
    reference_id TEXT,
    entity_type VARCHAR(50) CHECK (entity_type IN ('order', 'donation')),
    entity_id UUID,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    gateway VARCHAR(50) CHECK (gateway IN ('razorpay', 'stripe', 'paypal', 'upi')),
    method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    raw_response JSONB,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 6: CAREERS & JOB APPLICATIONS
-- ============================================

-- Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    requirements TEXT,
    department VARCHAR(100),
    location VARCHAR(255),
    job_type VARCHAR(50) DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
    experience VARCHAR(100),
    salary_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    featured BOOLEAN DEFAULT false,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    cv_url TEXT,
    cover_letter TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'offer', 'rejected', 'hired')),
    rating INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 7: INQUIRIES & RFQ
-- ============================================

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country_code VARCHAR(10),
    product VARCHAR(255),
    message TEXT,
    attachment_url TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    notes TEXT,
    assigned_to UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RFQ (Request for Quote)
CREATE TABLE IF NOT EXISTS public.rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    items JSONB NOT NULL,
    specifications TEXT,
    quantity INTEGER,
    target_price DECIMAL(12, 2),
    delivery_date DATE,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'quoted', 'accepted', 'rejected', 'expired')),
    quoted_price DECIMAL(12, 2),
    quoted_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 8: SHIPMENTS & LOGISTICS
-- ============================================

CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    shipment_status VARCHAR(50) DEFAULT 'pending' CHECK (shipment_status IN ('pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')),
    current_location TEXT,
    origin_location TEXT,
    destination_country VARCHAR(100),
    tracking_updates JSONB DEFAULT '[]',
    estimated_delivery DATE,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.logistics_partners (
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
    api_endpoint TEXT,
    tracking_url_template TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 9: BLOG & CONTENT
-- ============================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100),
    tags TEXT[],
    featured_image TEXT,
    author VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    views INT DEFAULT 0,
    seo_score INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    canonical_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Catalogs
CREATE TABLE IF NOT EXISTS public.catalogs (
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 10: SITE SETTINGS & CMS
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_settings (
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
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Pages
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 11: ANALYTICS & AUDIT LOGS
-- ============================================

-- Analytics Events
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255),
    user_id UUID,
    session_id VARCHAR(100),
    page_url TEXT,
    referrer TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs (Enterprise Security)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    actor_email TEXT,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 12: AUTO-GENERATE TRANSACTION IDs
-- ============================================

-- Orders transaction ID
CREATE OR REPLACE FUNCTION generate_order_txn()
RETURNS TRIGGER AS $$
BEGIN
    NEW.transaction_id := 'ORD-' || LPAD(NEW.order_serial::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_txn_trigger ON orders;
CREATE TRIGGER order_txn_trigger
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_txn();

-- Donations transaction ID
CREATE OR REPLACE FUNCTION generate_donation_txn()
RETURNS TRIGGER AS $$
BEGIN
    NEW.transaction_id := 'DON-' || LPAD(NEW.donation_serial::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS donation_txn_trigger ON donations;
CREATE TRIGGER donation_txn_trigger
BEFORE INSERT ON donations
FOR EACH ROW EXecute FUNCTION generate_donation_txn();

-- RFQ Number
CREATE OR REPLACE FUNCTION generate_rfq_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.rfq_number := 'RFQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rfq_number_trigger ON rfqs;
CREATE TRIGGER rfq_number_trigger
BEFORE INSERT ON rfqs
FOR EACH ROW EXECUTE FUNCTION generate_rfq_number();

-- Tracking Number
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tracking_number := 'SAV-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tracking_number_trigger ON shipments;
CREATE TRIGGER tracking_number_trigger
BEFORE INSERT ON shipments
FOR EACH ROW EXECUTE FUNCTION generate_tracking_number();

-- ============================================
-- STEP 13: UPDATED AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_industries_updated_at ON industries;
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON industries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON inquiries;
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rfqs_updated_at ON rfqs;
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipments_updated_at ON shipments;
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_logistics_partners_updated_at ON logistics_partners;
CREATE TRIGGER update_logistics_partners_updated_at BEFORE UPDATE ON logistics_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_catalogs_updated_at ON catalogs;
CREATE TRIGGER update_catalogs_updated_at BEFORE UPDATE ON catalogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_pages_updated_at ON cms_pages;
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_visitor_sessions_updated_at ON visitor_sessions;
CREATE TRIGGER update_visitor_sessions_updated_at BEFORE UPDATE ON visitor_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_generated_leads_updated_at ON ai_generated_leads;
CREATE TRIGGER update_ai_generated_leads_updated_at BEFORE UPDATE ON ai_generated_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audit_logs_updated_at ON audit_logs;
CREATE TRIGGER update_audit_logs_updated_at BEFORE UPDATE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 14: INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(id);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_session ON leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- Visitor Sessions
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session ON visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created ON visitor_sessions(created_at DESC);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_transaction ON orders(transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(email);

-- Donations
CREATE INDEX IF NOT EXISTS idx_donations_transaction ON donations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at DESC);

-- Shipments
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(shipment_status);
CREATE INDEX IF NOT EXISTS idx_shipments_created ON shipments(created_at DESC);

-- Job Applications
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created ON job_applications(created_at DESC);

-- Inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);

-- RFQs
CREATE INDEX IF NOT EXISTS idx_rfqs_number ON rfqs(rfq_number);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- STEP 15: STORAGE BUCKETS
-- ============================================

-- Product Images (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Blog Images (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Site Assets (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('site-assets', 'site-assets', true, 52428800, ARRAY['image/svg+xml', 'image/png', 'image/jpeg', 'application/javascript', 'text/css'])
ON CONFLICT (id) DO NOTHING;

-- Inquiries Attachments (Private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('inquiries', 'inquiries', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Documents (Private - CVs, Contracts)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
ON CONFLICT (id) DO NOTHING;

-- Lead Files (Private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('lead-files', 'lead-files', false, 10485760, ARRAY['application/pdf', 'application/zip', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Catalogs (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('catalogs', 'catalogs', true, 104857600, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 16: RLS SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin_request()
RETURNS BOOLEAN AS $$
DECLARE
    admin_key TEXT;
    provided_key TEXT;
BEGIN
    admin_key := NULLIF(current_setting('app.ADMIN_SECRET_KEY', true), '');
    IF admin_key IS NULL OR admin_key = '' THEN
        admin_key := 'saviman_admin_2024';
    END IF;
    provided_key := NULLIF(current_setting('request.headers', true)::jsonb->>'x-admin-key', '');
    RETURN provided_key = admin_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read policies (for active content)
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active industries" ON industries
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view published blogs" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view active catalogs" ON catalogs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active jobs" ON jobs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active logistics" ON logistics_partners
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view site settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Public can view published cms pages" ON cms_pages
    FOR SELECT USING (status = 'published');

-- Public insert policies (for forms)
CREATE POLICY "Anyone can submit leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can apply for jobs" ON job_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can track shipment" ON shipments
    FOR SELECT USING (true);

CREATE POLICY "Anyone can track order" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Anyone can submit donations" ON donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit rfqs" ON rfqs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can track visitor" ON visitor_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create analytics event" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Admin only policies (full access)
CREATE POLICY "Admin full access profiles" ON profiles
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access admin_users" ON admin_users
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access leads" ON leads
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access visitor_sessions" ON visitor_sessions
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access ai_generated_leads" ON ai_generated_leads
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access products" ON products
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access industries" ON industries
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access orders" ON orders
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access order_tracking" ON order_tracking
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access donations" ON donations
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access payment_transactions" ON payment_transactions
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access jobs" ON jobs
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access job_applications" ON job_applications
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access inquiries" ON inquiries
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access rfqs" ON rfqs
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access shipments" ON shipments
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access logistics_partners" ON logistics_partners
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access blog_posts" ON blog_posts
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access catalogs" ON catalogs
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access site_settings" ON site_settings
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access cms_pages" ON cms_pages
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access analytics_events" ON analytics_events
    FOR ALL USING (is_admin_request());

CREATE POLICY "Admin full access audit_logs" ON audit_logs
    FOR ALL USING (is_admin_request());

-- Storage policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin storage access" ON storage.objects
    FOR ALL USING (
        bucket_id IN ('product-images', 'blog-images', 'site-assets', 'inquiries', 'documents', 'lead-files', 'catalogs')
        AND is_admin_request()
    );

-- Public read for public buckets
CREATE POLICY "Public read product-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Public read blog-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Public read site-assets" ON storage.objects
    FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Public read catalogs" ON storage.objects
    FOR SELECT USING (bucket_id = 'catalogs');

-- ============================================
-- STEP 17: SEED DATA
-- ============================================

-- Default site settings
INSERT INTO site_settings (id, site_name, tagline, contact_email, contact_phone, footer_text)
VALUES (1, 'Antigravit OpenCode', 'Enterprise SaaS Platform', 'satyendra191@gmail.com', '+91 98765 43210', '© 2024 Antigravit OpenCode. Designed by SaviTech')
ON CONFLICT (id) DO NOTHING;

-- Insert default logistics partners
INSERT INTO logistics_partners (name, partner_type, description, website, coverage_countries, service_types, status, is_international, rating) VALUES
    ('DHL Express', 'international', 'Global leader in express shipping', 'https://www.dhl.com', ARRAY['USA', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Canada', 'UAE', 'India', 'China'], ARRAY['Express', 'Air Freight', 'Ocean Freight'], 'active', true, 4.8),
    ('FedEx', 'international', 'Global express shipping company', 'https://www.fedex.com', ARRAY['USA', 'Canada', 'UK', 'Germany', 'Japan', 'China', 'India', 'Australia'], ARRAY['Express', 'Freight', 'Ground'], 'active', true, 4.7),
    ('UPS', 'international', 'United Parcel Service', 'https://www.ups.com', ARRAY['USA', 'Europe', 'Asia'], ARRAY['Express', 'Ground', 'Freight'], 'active', true, 4.6),
    ('Indian Post', 'domestic', 'India Post - Government postal service', 'https://www.indiapost.gov.in', ARRAY['India'], ARRAY['Standard', 'Registered', 'Speed Post'], 'active', false, 4.0)
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 18: RELOAD SCHEMA
-- ============================================
NOTIFY pgrst, 'reload schema';

-- ============================================
-- COMPLETE - Schema is ready!
-- ============================================
