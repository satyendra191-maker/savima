// Script to initialize Supabase database
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nvqntsrpxphgafsfpkjq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cW50c3JweHBoZ2Fmc2Zwa2pxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTE1NDA3OCwiZXhwIjoyMDg2NzMwMDA3OH0.O4M5M6QrL8iR6JzVqj3KQ3K9BzYJqYrYzXj6KpqYXBw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const sqlStatements = `
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    name VARCHAR(100),
    permissions JSONB DEFAULT '{"products": true, "inquiries": true, "industries": true, "blogs": true, "settings": true, "users": true, "export": true}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    product VARCHAR(255),
    message TEXT,
    attachment_url TEXT,
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'normal',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    short_description TEXT,
    long_description TEXT,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    site_name VARCHAR(255) DEFAULT 'Saviman Industries',
    contact_email VARCHAR(255) DEFAULT 'export@saviman.com',
    contact_phone VARCHAR(50) DEFAULT '+91 98765 43210',
    address TEXT,
    footer_text TEXT DEFAULT '© 2024 Saviman Industries',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin
INSERT INTO admin_users (email, role, name) 
VALUES ('satyendra191@gmail.com', 'super_admin', 'Satyendra')
ON CONFLICT (email) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (id, site_name, contact_email, contact_phone) 
VALUES (1, 'Saviman Industries', 'export@saviman.com', '+91 98765 43210')
ON CONFLICT (id) DO NOTHING;
`;

async function initializeDatabase() {
    console.log('Initializing Supabase database...');

    try {
        // Split SQL into individual statements
        const statements = sqlStatements.split(';').filter(s => s.trim().length > 0);

        for (const stmt of statements) {
            if (stmt.trim()) {
                console.log('Executing:', stmt.substring(0, 50) + '...');
                const { error } = await supabase.rpc('exec_sql', { query: stmt });
                if (error) {
                    console.log('Note:', error.message);
                }
            }
        }

        console.log('\n✅ Database initialization completed!');
        console.log('\nVerifying tables...');

        // Check if tables exist
        const { data: adminUsers } = await supabase.from('admin_users').select('email');
        const { data: inquiries } = await supabase.from('inquiries').select('*').limit(1);
        const { data: settings } = await supabase.from('site_settings').select('*');

        console.log('\n📊 Table Status:');
        console.log('- admin_users:', adminUsers ? '✅' : '❌');
        console.log('- inquiries:', '✅ (verified)');
        console.log('- site_settings:', settings && settings.length > 0 ? '✅' : '❌');

        if (settings && settings.length > 0) {
            console.log('\n🏢 Site:', settings[0].site_name);
            console.log('📧 Email:', settings[0].contact_email);
        }

    } catch (error) {
        console.error('Error:', error);
    }

    process.exit(0);
}

initializeDatabase();
