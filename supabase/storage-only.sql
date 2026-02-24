-- ============================================
-- STORAGE BUCKETS (Run separately if needed)
-- ============================================

-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit) VALUES 
('product-images', 'product-images', true, 10485760),
('blog-images', 'blog-images', true, 10485760),
('site-assets', 'site-assets', true, 52428800),
('inquiries', 'inquiries', false, 10485760),
('documents', 'documents', false, 52428800),
('lead-files', 'lead-files', false, 10485760),
('catalogs', 'catalogs', true, 104857600)
ON CONFLICT (id) DO NOTHING;

-- Check existing buckets
SELECT id, name, public, file_size_limit FROM storage.buckets;

NOTIFY pgrst, 'reload schema';

SELECT 'Buckets created' as status;
