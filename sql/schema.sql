
/* 
   SAVIMAN FINAL PRODUCTION SCHEMA
   -------------------------------
   Run this script in the Supabase SQL Editor.
   It creates the necessary tables and policies for the app.
*/

-- 1. Inquiries Table (Lead Capture)
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,           -- Required for chatbot leads
  company text,         -- Required for chatbot leads
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  short_description text,
  long_description text,
  industry_usage text,
  technical_highlights text[],
  image_url text,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CMS Tables
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name text DEFAULT 'Saviman Industries',
  contact_email text DEFAULT 'export@saviman.com',
  contact_phone text DEFAULT '+91 98765 43210',
  address text,
  social_links jsonb DEFAULT '{}'::jsonb,
  footer_text text DEFAULT '© 2024 Saviman Industries',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text,
  meta_title text,
  meta_description text,
  sections jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Security Policies (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT inquiries (Chatbot/Contact Form)
DROP POLICY IF EXISTS "Public Insert Inquiries" ON inquiries;
CREATE POLICY "Public Insert Inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Allow admins to DO EVERYTHING on inquiries
DROP POLICY IF EXISTS "Admin All Inquiries" ON inquiries;
CREATE POLICY "Admin All Inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');

-- Products are readable by everyone, editable by admin
DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Products" ON products;
CREATE POLICY "Admin All Products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Settings/Pages readable by everyone, editable by admin
DROP POLICY IF EXISTS "Public Read Settings" ON site_settings;
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Settings" ON site_settings;
CREATE POLICY "Admin All Settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public Read Pages" ON cms_pages;
CREATE POLICY "Public Read Pages" ON cms_pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Pages" ON cms_pages;
CREATE POLICY "Admin All Pages" ON cms_pages FOR ALL USING (auth.role() = 'authenticated');

-- 5. Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('saviman-inquiries', 'saviman-inquiries', true) ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public Read Products Bucket" ON storage.objects;
CREATE POLICY "Public Read Products Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'products');
DROP POLICY IF EXISTS "Admin Write Products Bucket" ON storage.objects;
CREATE POLICY "Admin Write Products Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public Write Inquiries Bucket" ON storage.objects;
CREATE POLICY "Public Write Inquiries Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'saviman-inquiries');

-- 6. Reload Cache
NOTIFY pgrst, 'reload schema';
