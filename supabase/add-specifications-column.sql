-- ============================================
-- FIX: Add specifications JSONB column to products table
-- This allows storing product specifications as key-value pairs
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;

-- Also add other missing columns that may be needed
ALTER TABLE products ADD COLUMN IF NOT EXISTS model_name VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS version VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS brochure_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];

SELECT '✅ Added specifications and other missing columns to products table!' as message;
