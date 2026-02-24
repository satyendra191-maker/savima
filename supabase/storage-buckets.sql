-- ============================================
-- STORAGE BUCKETS SETUP
-- Run this separately after main schema
-- ============================================

-- Create storage buckets (this should work)
INSERT INTO storage.buckets (id, name, public, file_size_limit) VALUES 
('product-images', 'product-images', true, 10485760),
('blog-images', 'blog-images', true, 10485760),
('site-assets', 'site-assets', true, 52428800),
('inquiries', 'inquiries', false, 10485760),
('documents', 'documents', false, 52428800),
('lead-files', 'lead-files', false, 10485760),
('catalogs', 'catalogs', true, 104857600)
ON CONFLICT (id) DO NOTHING;

-- Verify buckets created
SELECT id, name, public, file_size_limit FROM storage.buckets;

-- ============================================
-- RELOAD SCHEMA
-- ============================================
NOTIFY pgrst, 'reload schema';

SELECT 'Storage buckets created successfully!' as status;
