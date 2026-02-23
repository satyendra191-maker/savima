-- ============================================
-- SAVIMAN - Simple RLS Policies
-- Run AFTER schema-fix-columns.sql
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies - anyone can do anything (for now)
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage products" ON products;
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view industries" ON industries;
CREATE POLICY "Public can view industries" ON industries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage industries" ON industries;
CREATE POLICY "Admin can manage industries" ON industries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can create inquiries" ON inquiries;
CREATE POLICY "Public can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage inquiries" ON inquiries;
CREATE POLICY "Admin can manage inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view catalogs" ON catalogs;
CREATE POLICY "Public can view catalogs" ON catalogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage catalogs" ON catalogs;
CREATE POLICY "Admin can manage catalogs" ON catalogs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view careers" ON careers;
CREATE POLICY "Public can view careers" ON careers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage careers" ON careers;
CREATE POLICY "Admin can manage careers" ON careers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can create donations" ON donations;
CREATE POLICY "Public can create donations" ON donations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage donations" ON donations;
CREATE POLICY "Admin can manage donations" ON donations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view blog_posts" ON blog_posts;
CREATE POLICY "Public can view blog_posts" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage blog_posts" ON blog_posts;
CREATE POLICY "Admin can manage blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

SELECT '✅ RLS policies set up!' as message;
