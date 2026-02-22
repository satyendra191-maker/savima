-- SAVIMAN PRODUCTION DATA SEED
-- Run this in your Supabase SQL Editor to populate with real products.

-- Clear existing products (Optional)
-- DELETE FROM products;

INSERT INTO products (name, slug, category, short_description, long_description, industry_usage, technical_highlights, image_url)
VALUES 
(
  'SS High-Pressure Hydraulic Fitting', 
  'ss-hydraulic-fitting', 
  'steel', 
  'Precision-engineered SS 316 fittings for high-pressure industrial hydraulic systems.', 
  'Our stainless steel hydraulic fittings are manufactured using premium grade SS 316, ensuring maximum corrosion resistance and durability. Designed to withstand extreme pressures up to 10,000 PSI.', 
  'Aerospace, Oil & Gas, Automotive', 
  ARRAY['Material: SS 316/304', 'Pressure Rating: 10,000 PSI', 'Corrosion Resistant', 'ISO Certified'],
  '/images/ss-fitting.png'
),
(
  'Precision Brass Knurled Inserts', 
  'brass-knurled-inserts', 
  'brass', 
  'High-quality brass inserts for plastic molding and electronic assemblies.', 
  'Custom-designed brass knurled inserts with diamond or straight knurling patterns. Perfect for thermal or ultrasonic installation in thermoplastic materials.', 
  'Electronics, Consumer Goods, Automotive', 
  ARRAY['Consistent Threads', 'Superior Pull-out Resistance', 'RoHS Compliant'],
  '/images/brass-cat.png'
),
(
  'SS Valve Connector Node', 
  'ss-valve-connector', 
  'steel', 
  'Heavy duty valve connectors for chemical processing plants.', 
  'Expertly machined stainless steel valve nodes with zero-leakage performance. Compatible with various industrial solvents and high-temperature fluids.', 
  'Chemical Processing, Water Treatment', 
  ARRAY['Leak-proof Design', 'High Temperature Tolerance', 'Precision Threading'],
  '/images/steel-cat.png'
)
ON CONFLICT (slug) DO UPDATE 
SET 
  image_url = EXCLUDED.image_url,
  short_description = EXCLUDED.short_description;
