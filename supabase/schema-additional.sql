-- ============================================
-- SAVIMAN ADDITIONAL TABLES
-- Run this in Supabase SQL Editor
-- ============================================

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
-- CAREERS TABLE (Job Openings)
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
-- CAREER APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS career_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
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
-- SHIPMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shipments (
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
    contract_start DATE,
    contract_end DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================

ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_partners ENABLE ROW LEVEL SECURITY;

-- Catalog Policies
CREATE POLICY "Public can view active catalogs" ON catalogs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage catalogs" ON catalogs
    FOR ALL USING (is_admin());

-- Careers Policies
CREATE POLICY "Public can view active careers" ON careers
    FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can apply for jobs" ON careers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage careers" ON careers
    FOR ALL USING (is_admin());

-- Career Applications Policies
CREATE POLICY "Public can submit applications" ON career_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view applications" ON career_applications
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update applications" ON career_applications
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete applications" ON career_applications
    FOR DELETE USING (is_admin());

-- Donations Policies
CREATE POLICY "Anyone can create donations" ON donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view donations" ON donations
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update donations" ON donations
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete donations" ON donations
    FOR DELETE USING (is_admin());

-- Shipments Policies
CREATE POLICY "Public can track shipments" ON shipments
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage shipments" ON shipments
    FOR ALL USING (is_admin());

-- Logistics Partners Policies
CREATE POLICY "Public can view active partners" ON logistics_partners
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage partners" ON logistics_partners
    FOR ALL USING (is_admin());

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_catalogs_status ON catalogs(status);
CREATE INDEX idx_catalogs_category ON catalogs(category);

CREATE INDEX idx_careers_status ON careers(status);
CREATE INDEX idx_careers_department ON careers(department);
CREATE INDEX idx_careers_location ON careers(location);

CREATE INDEX idx_career_applications_status ON career_applications(status);
CREATE INDEX idx_career_applications_career_id ON career_applications(career_id);

CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_created ON donations(created_at DESC);

CREATE INDEX idx_shipments_status ON shipments(shipment_status);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);

CREATE INDEX idx_logistics_partners_status ON logistics_partners(status);
CREATE INDEX idx_logistics_partners_type ON logistics_partners(partner_type);

-- ============================================
-- TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_catalogs_updated_at ON catalogs;
CREATE TRIGGER update_catalogs_updated_at BEFORE UPDATE ON catalogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_careers_updated_at ON careers;
CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_career_applications_updated_at ON career_applications;
CREATE TRIGGER update_career_applications_updated_at BEFORE UPDATE ON career_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipments_updated_at ON shipments;
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_logistics_partners_updated_at ON logistics_partners;
CREATE TRIGGER update_logistics_partners_updated_at BEFORE UPDATE ON logistics_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET FOR CATALOGS
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('catalogs', 'catalogs', true, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Catalog storage policies
CREATE POLICY "Public can view catalogs" ON storage.objects
    FOR SELECT USING (bucket_id = 'catalogs');

CREATE POLICY "Admins can upload catalogs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'catalogs' AND is_admin());

CREATE POLICY "Admins can delete catalogs" ON storage.objects
    FOR DELETE USING (bucket_id = 'catalogs' AND is_admin());

-- ============================================
-- DONE!
-- ============================================
