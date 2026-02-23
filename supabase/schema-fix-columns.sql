-- ============================================
-- FIX: Add missing columns to existing tables
-- Run this to add required columns
-- ============================================

-- Add status column to existing products table if missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- Add status column to existing industries table if missing
ALTER TABLE industries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE industries ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add status column to existing inquiries table if missing
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';

-- Add status column to existing catalogs table if missing
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Add status column to existing careers table if missing
ALTER TABLE careers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Add payment_status column to existing donations table if missing
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

-- Add status column to existing blog_posts table if missing
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';

SELECT '✅ Missing columns added!' as message;
