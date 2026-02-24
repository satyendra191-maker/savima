-- ============================================
-- SAVIMAN REALTIME DATABASE CONFIGURATION
-- Enable real-time subscriptions for all tables
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- ENABLE REALTIME FOR ALL TABLES
-- ============================================

-- Enable realtime on products table
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Enable realtime on inquiries table
ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;

-- Enable realtime on industries table
ALTER PUBLICATION supabase_realtime ADD TABLE industries;

-- Enable realtime on blog_posts table
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;

-- Enable realtime on careers table
ALTER PUBLICATION supabase_realtime ADD TABLE careers;

-- Enable realtime on donations table
ALTER PUBLICATION supabase_realtime ADD TABLE donations;

-- Enable realtime on shipments table
ALTER PUBLICATION supabase_realtime ADD TABLE shipments;

-- Enable realtime on logistics table
ALTER PUBLICATION supabase_realtime ADD TABLE logistics;

-- Enable realtime on admin_users table
ALTER PUBLICATION supabase_realtime ADD TABLE admin_users;

-- Enable realtime on leads table
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- ============================================
-- CREATE REALTIME FUNCTION FOR BROADCAST
-- ============================================

CREATE OR REPLACE FUNCTION notify_event()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify(
        TG_TABLE_NAME || '_changes',
        json_build_object(
            'operation', TG_OP,
            'record', row_to_json(NEW),
            'old_record', row_to_json(OLD)
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CREATE TRIGGERS FOR REALTIME NOTIFICATIONS
-- ============================================

-- Products trigger
DROP TRIGGER IF EXISTS products_realtime_trigger ON products;
CREATE TRIGGER products_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- Inquiries trigger
DROP TRIGGER IF EXISTS inquiries_realtime_trigger ON inquiries;
CREATE TRIGGER inquiries_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON inquiries
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- Industries trigger
DROP TRIGGER IF EXISTS industries_realtime_trigger ON industries;
CREATE TRIGGER industries_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON industries
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- Blog posts trigger
DROP TRIGGER IF EXISTS blog_posts_realtime_trigger ON blog_posts;
CREATE TRIGGER blog_posts_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- Careers trigger
DROP TRIGGER IF EXISTS careers_realtime_trigger ON careers;
CREATE TRIGGER careers_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON careers
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- Donations trigger
DROP TRIGGER IF EXISTS donations_realtime_trigger ON donations;
CREATE TRIGGER donations_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON donations
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- Shipments trigger
DROP TRIGGER IF EXISTS shipments_realtime_trigger ON shipments;
CREATE TRIGGER shipments_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON shipments
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- Logistics trigger
DROP TRIGGER IF EXISTS logistics_realtime_trigger ON logistics;
CREATE TRIGGER logistics_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON logistics
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- Leads trigger
DROP TRIGGER IF EXISTS leads_realtime_trigger ON leads;
CREATE TRIGGER leads_realtime_trigger
AFTER INSERT OR UPDATE OR DELETE ON leads
FOR EACH ROW EXECUTE FUNCTION notify_event();

-- ============================================
-- ENABLE RLS FOR REALTIME
-- ============================================

-- Enable realtime for authenticated users
CREATE POLICY "Enable realtime for authenticated users"
ON publications FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- CREATE LEADS TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    product_interest VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'normal',
    source VARCHAR(100),
    value DECIMAL(12, 2) DEFAULT 0,
    assigned_to UUID REFERENCES admin_users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert on leads"
ON leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read on leads"
ON leads FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update on leads"
ON leads FOR UPDATE
TO authenticated
USING (true);

-- Enable realtime on leads
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- ============================================
-- CREATE ORDERS TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    shipping_address TEXT,
    products JSONB NOT NULL,
    subtotal DECIMAL(12, 2) DEFAULT 0,
    tax DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read on orders"
ON orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated update on orders"
ON orders FOR UPDATE
TO authenticated
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ============================================
-- CREATE NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES admin_users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on notifications"
ON notifications FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert on notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on notifications"
ON notifications FOR UPDATE
TO authenticated
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- CREATE CHAT/MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL,
    user_id UUID,
    user_type VARCHAR(20) DEFAULT 'visitor',
    message TEXT NOT NULL,
    is_from_admin BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on chat_messages"
ON chat_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read on chat_messages"
ON chat_messages FOR SELECT
TO authenticated
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- ============================================
-- CREATE ANALYTICS EVENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    session_id VARCHAR(100),
    user_id UUID,
    user_email VARCHAR(255),
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on analytics_events"
ON analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read on analytics_events"
ON analytics_events FOR SELECT
TO authenticated
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;

-- ============================================
-- UPDATE UPDATED_AT TIMESTAMP FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON inquiries;
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_industries_updated_at ON industries;
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON industries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant table permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES TO authenticated;
GRANT USAGE ON ALL SEQUENCES TO anon;
GRANT USAGE ON ALL SEQUENCES TO authenticated;

-- ============================================
-- VERIFY REALTIME IS WORKING
-- ============================================

-- Check if realtime is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check publications
SELECT * FROM pg_publication_tables;

-- ============================================
-- END OF REALTIME CONFIGURATION
-- ============================================
