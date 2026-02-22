
/* 
   === DANGER: CLEANUP SCRIPT ===
   This will DELETE all existing data in tables.
   Run this only if you want a fresh start.
*/

DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS cms_pages CASCADE;

-- Note: We do not drop storage buckets via SQL to avoid permission locks. 
-- You can delete buckets manually in the Storage dashboard if needed.
