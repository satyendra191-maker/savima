-- ============================================
-- SAVIMAN ENTERPRISE - MASTER PRODUCTION SCHEMA v2.0
-- Optimized for RBAC, CRM, ERP, and AI Integration
-- ============================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & CONSTANTS
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'sales_manager', 'inventory_manager', 'user', 'guest');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. CORE TABLES
-- Profiles (RBAC)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role public.user_role DEFAULT 'user',
    phone TEXT,
    company_name TEXT,
    avatar_url TEXT,
    permissions JSONB DEFAULT '{"leads": true, "products": true, "orders": false}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS & ASSETS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    price DECIMAL(12, 2) DEFAULT 0.00,
    moq INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    featured BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CRM & LEADS
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    country_code TEXT,
    requirement_description TEXT,
    buying_intent_score INTEGER DEFAULT 0,
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'ai_chat', 'rfq', 'contact_form')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'quoted', 'won', 'lost')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Captured Conversations (Deep Lead Gen)
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    messages JSONB NOT NULL,
    lead_id UUID REFERENCES public.leads(id),
    intent_analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROCUREMENT & RFQs
CREATE TABLE IF NOT EXISTS public.rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_number TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES public.leads(id),
    items JSONB NOT NULL, -- Array of items requested
    drawings_urls TEXT[] DEFAULT '{}',
    target_date DATE,
    shipping_incoterms TEXT DEFAULT 'EXW',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'quoted', 'negotiating', 'approved', 'declined')),
    total_quoted_amount DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS & LOGISTICS (ERP)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id),
    lead_id UUID REFERENCES public.leads(id),
    total_amount DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    shipment_status TEXT DEFAULT 'pending' CHECK (shipment_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    billing_address JSONB,
    shipping_address JSONB,
    items JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_number TEXT UNIQUE NOT NULL,
    carrier TEXT NOT NULL,
    current_status TEXT NOT NULL,
    estimated_delivery TIMESTAMPTZ,
    tracking_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_modtime BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfqs_modtime BEFORE UPDATE ON public.rfqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_modtime BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. FUNCTIONS FOR AUTO-GENERATING NUMBERS
CREATE OR REPLACE FUNCTION generate_rfq_num() RETURNS TRIGGER AS $$
BEGIN
    NEW.rfq_number := 'RFQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval(pg_get_serial_sequence('leads', 'id'))::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own, Admins view all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- Products: Everyone can view active products, Admins manage all
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'inventory_manager')));

-- Leads: Only Sales/Admins can view
CREATE POLICY "Sales can managed leads" ON public.leads FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'sales_manager')));

-- 11. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('product-assets', 'product-assets', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('lead-drawings', 'lead-drawings', false) ON CONFLICT (id) DO NOTHING;

RAISE NOTICE 'Saviman Master Schema v2.0 deployed successfully.';
