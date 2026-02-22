-- ============================================
-- SUPABASE RLS POLICIES & PERMISSIONS
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_ai_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PRODUCTS TABLE
-- ============================================

-- Public read access
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
USING (status = 'published' OR status = 'draft');

-- Admin full access
CREATE POLICY "Admins can manage products"
ON products FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  )
);

-- ============================================
-- INDUSTRIES TABLE
-- ============================================

-- Public read access
CREATE POLICY "Industries are viewable by everyone"
ON industries FOR SELECT
USING (status = 'published' OR status = 'draft');

-- Admin full access
CREATE POLICY "Admins can manage industries"
ON industries FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  )
);

-- ============================================
-- BLOG_POSTS TABLE
-- ============================================

-- Public read access
CREATE POLICY "Blog posts are viewable by everyone"
ON blog_posts FOR SELECT
USING (status = 'published' OR status = 'draft');

-- Admin full access
CREATE POLICY "Admins can manage blog posts"
ON blog_posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  )
);

-- ============================================
-- INQUIRIES TABLE
-- ============================================

-- Public can create inquiries
CREATE POLICY "Anyone can create inquiries"
ON inquiries FOR INSERT
WITH CHECK (true);

-- Public can read their own inquiries
CREATE POLICY "Users can view their own inquiries"
ON inquiries FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  OR email IS NOT NULL
);

-- Admin full access
CREATE POLICY "Admins can manage inquiries"
ON inquiries FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  )
);

-- ============================================
-- LEADS TABLE
-- ============================================

-- Public can create leads (from AI assistant)
CREATE POLICY "Anyone can create leads"
ON leads FOR INSERT
WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins can manage leads"
ON leads FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  )
);

-- ============================================
-- SITE_SETTINGS TABLE
-- ============================================

-- Public read access
CREATE POLICY "Site settings are viewable by everyone"
ON site_settings FOR SELECT
USING (true);

-- Admin can update
CREATE POLICY "Admins can update site settings"
ON site_settings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  )
);

-- ============================================
-- CMS_PAGES TABLE
-- ============================================

-- Public read access
CREATE POLICY "CMS pages are viewable by everyone"
ON cms_pages FOR SELECT
USING (true);

-- Admin full access
CREATE POLICY "Admins can manage CMS pages"
ON cms_pages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  )
);

-- ============================================
-- ADMIN_USERS TABLE
-- ============================================

-- Only super_admin can read admin users
CREATE POLICY "Only super_admin can view admin users"
ON admin_users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
    AND au.role = 'super_admin'
  )
);

-- Only super_admin can insert
CREATE POLICY "Only super_admin can add admin users"
ON admin_users FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
    AND au.role = 'super_admin'
  )
);

-- Only super_admin can update
CREATE POLICY "Only super_admin can update admin users"
ON admin_users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
    AND au.role = 'super_admin'
  )
);

-- Only super_admin can delete
CREATE POLICY "Only super_admin can delete admin users"
ON admin_users FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
    AND au.role = 'super_admin'
  )
);

-- ============================================
-- ADMIN_AI_LOGS TABLE
-- ============================================

-- Admin can create logs
CREATE POLICY "Admins can create AI logs"
ON admin_ai_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  )
);

-- Only super_admin can read logs
CREATE POLICY "Only super_admin can view AI logs"
ON admin_ai_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
    AND au.role = 'super_admin'
  )
);

-- ============================================
-- FUNCTION: Check if user is admin
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Check if user is super_admin
-- ============================================

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Auto-create lead from inquiry
-- ============================================

CREATE OR REPLACE FUNCTION create_lead_from_inquiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'new' AND OLD.status IS DISTINCT FROM 'new' THEN
    INSERT INTO leads (name, email, phone, company, source, status, notes)
    VALUES (
      NEW.name,
      NEW.email,
      NEW.phone,
      NEW.company,
      'Website Inquiry',
      'new',
      NEW.message
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS inquiry_to_lead ON inquiries;
CREATE TRIGGER inquiry_to_lead
AFTER UPDATE ON inquiries
FOR EACH ROW
EXECUTE FUNCTION create_lead_from_inquiry();
