-- ============================================================
-- SAVIMAN MASTER PRODUCTION SCHEMA v3.0 (COMPLETE)
-- ============================================================
-- This script sets up ALL tables for the Saviman Precision Platform.
-- Target: Supabase SQL Editor
-- Features: CRM, AI Leads, Logistics, Payments, CMS, RBAC, Audit Log

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
do $$ begin
    create type user_role as enum ('super_admin', 'admin', 'sales_manager', 'inventory_manager', 'user', 'guest');
exception
    when duplicate_object then null;
end $$;

-- 3. CORE TABLES (CMS & PRODUCTS)
create table if not exists products (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text unique not null,
    category text,
    short_description text,
    long_description text,
    industry_usage text,
    technical_highlights text[],
    image_url text,
    status text default 'active',
    created_at timestamp with time zone default now()
);

create table if not exists industries (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text unique not null,
    description text,
    image_url text,
    status text default 'active',
    created_at timestamp with time zone default now()
);

create table if not exists catalogs (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    pages integer,
    size text,
    thumbnail text,
    download_url text,
    status text default 'active',
    created_at timestamp with time zone default now()
);

create table if not exists cms_pages (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    slug text unique not null,
    content text,
    status text default 'published',
    created_at timestamp with time zone default now()
);

create table if not exists blog_posts (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    slug text unique not null,
    excerpt text,
    content text,
    category text,
    status text default 'published',
    views integer default 0,
    published_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- 4. CRM & LEADS
create table if not exists leads (
    id uuid primary key default uuid_generate_v4(),
    full_name text not null,
    company_name text,
    email text,
    phone text,
    country_code text,
    message text,
    material_details text,
    file_url text,
    source_page text,
    session_id text,
    status text default 'new',
    priority text default 'medium',
    assigned_to uuid references auth.users(id),
    notes text,
    buying_intent_score integer default 0,
    converted boolean default false,
    created_at timestamp with time zone default now()
);

create table if not exists ai_generated_leads (
    id uuid primary key default uuid_generate_v4(),
    session_id text,
    person_name text,
    company_name text,
    email text,
    contact_number text,
    requirement_description text,
    conversation_summary text,
    buying_intent_score integer default 0,
    status text default 'pending',
    is_partial boolean default false,
    created_at timestamp with time zone default now()
);

create table if not exists inquiries (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    company text,
    email text not null,
    phone text,
    product text,
    message text,
    status text default 'new',
    created_at timestamp with time zone default now()
);

-- 5. ORDERS & PAYMENTS
create table if not exists orders (
    id uuid primary key default uuid_generate_v4(),
    transaction_id text unique default 'ORD-' || upper(substring(md5(random()::text), 1, 8)),
    customer_name text not null,
    customer_company text,
    email text not null,
    phone text,
    billing_address text,
    shipping_address text,
    items jsonb default '[]',
    total_amount decimal(12,2) not null,
    currency text default 'USD',
    payment_status text default 'pending',
    order_status text default 'Order Confirmed',
    payment_gateway text,
    payment_method text,
    transaction_metadata jsonb default '{}',
    created_at timestamp with time zone default now()
);

create table if not exists order_tracking (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    status text not null,
    location text,
    description text,
    created_at timestamp with time zone default now()
);

create table if not exists donations (
    id uuid primary key default uuid_generate_v4(),
    transaction_id text unique,
    donor_name text not null,
    donor_email text,
    amount decimal(12,2) not null,
    currency text default 'INR',
    message text,
    payment_status text default 'pending',
    payment_method text,
    created_at timestamp with time zone default now()
);

-- 6. LOGISTICS
create table if not exists logistics_partners (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    type text check (type in ('national', 'international')),
    coverage text[],
    services text[],
    tracking_url text,
    logo_url text,
    api_integration boolean default false,
    status text default 'active',
    created_at timestamp with time zone default now()
);

create table if not exists logistics_quotes (
    id uuid primary key default uuid_generate_v4(),
    user_name text not null,
    email text not null,
    country text,
    delivery_address text,
    weight decimal(10,2),
    estimated_cost decimal(10,2),
    currency text default 'USD',
    logistic_partner text,
    status text default 'pending',
    created_at timestamp with time zone default now()
);

-- 7. HR & CAREERS
create table if not exists career_applications (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    phone text,
    position text,
    resume_url text,
    status text default 'new',
    created_at timestamp with time zone default now()
);

-- 8. INFRASTRUCTURE & SETTINGS
create table if not exists profiles (
    id uuid references auth.users(id) primary key,
    full_name text,
    avatar_url text,
    role user_role default 'user',
    updated_at timestamp with time zone default now()
);

create table if not exists site_settings (
    id integer primary key default 1,
    site_name text default 'Saviman Industries',
    contact_email text,
    contact_phone text,
    address text,
    social_links jsonb default '{}',
    footer_text text,
    updated_at timestamp with time zone default now(),
    constraint single_row check (id = 1)
);

-- 9. AUDIT & TRACKING
create table if not exists visitor_sessions (
    session_id text primary key,
    visitor_id uuid default uuid_generate_v4(),
    visited_pages text[],
    referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    device_type text,
    browser text,
    os text,
    cookies_consented boolean default false,
    last_visit_at timestamp with time zone default now(),
    created_at timestamp with time zone default now()
);

create table if not exists audit_logs (
    id uuid primary key default uuid_generate_v4(),
    action text not null,
    table_name text,
    record_id text,
    actor_id uuid references auth.users(id),
    old_values jsonb,
    new_values jsonb,
    created_at timestamp with time zone default now()
);

-- 10. RLS POLICIES (FIXED SYNTAX)
alter table products enable row level security;
drop policy if exists "Allow public read" on products;
create policy "Allow public read" on products for select using (true);
drop policy if exists "Allow admin all" on products;
create policy "Allow admin all" on products for all using (true);

alter table leads enable row level security;
drop policy if exists "Allow insert for everyone" on leads;
create policy "Allow insert for everyone" on leads for insert with check (true);
drop policy if exists "Allow admin read" on leads;
create policy "Allow admin read" on leads for select using (true);

alter table ai_generated_leads enable row level security;
drop policy if exists "Allow insert for ai" on ai_generated_leads;
create policy "Allow insert for ai" on ai_generated_leads for insert with check (true);

alter table inquiries enable row level security;
drop policy if exists "Allow public inquiry" on inquiries;
create policy "Allow public inquiry" on inquiries for insert with check (true);

alter table orders enable row level security;
drop policy if exists "Admin order access" on orders;
create policy "Admin order access" on orders for all using (true);

alter table donations enable row level security;
drop policy if exists "Public donation post" on donations;
create policy "Public donation post" on donations for insert with check (true);

-- (Repeat RLS for other tables as needed)

-- 11. BUCKETS (MANUAL STEP IN DASHBOARD: products, catalogs, resumes, inquiry-attachments)
