# ANTIGRAVIT OPENCODE - ENTERPRISE MASTER PROMPT

## Project URL
https://antigravit-opencode-56swzuswd-satyendra-yadavas-projects.vercel.app/

---

## 1. SUPABASE DATABASE SCHEMA

Run the following SQL in your Supabase SQL Editor:

**File:** `supabase/production-master-schema.sql`

This includes:
- Profiles with RBAC (super_admin, admin, finance_admin, hr_admin, user, anon)
- Leads & AI Generated Leads
- Visitor Sessions (Cookie Tracking)
- Products & Industries
- Orders with auto-generated transaction IDs
- Order Tracking
- Donations
- Payment Transactions
- Jobs & Job Applications
- Inquiries & RFQs
- Shipments & Logistics Partners
- Blog Posts & Catalogs
- Site Settings & CMS Pages
- Analytics Events
- Audit Logs

---

## 2. ROLE-BASED ACCESS CONTROL (RBAC)

**Roles defined in profiles.role:**
- `super_admin` → Full system access
- `admin` → Manage content, orders, leads
- `finance_admin` → Manage payments only
- `hr_admin` → Manage jobs & applications
- `user` → Public authenticated user
- `anon` → Public visitor

**Admin credentials:**
- Email: `satyendra191@gmail.com`
- Password: `saviman2024`

---

## 3. RLS SECURITY POLICIES

All tables have Row Level Security enabled:

**Public Read** (for active content):
- products, industries, blog_posts (published), catalogs (active), jobs (active), logistics_partners (active), site_settings, cms_pages (published)

**Public Insert** (for forms):
- leads, inquiries, job_applications, donations, rfqs, visitor_sessions, analytics_events

**Admin Only** (full access via x-admin-key header):
- All tables accessible with proper admin header

---

## 4. STORAGE BUCKETS

Create these buckets in Supabase Storage:

| Bucket Name | Public | File Size Limit | Purpose |
|------------|--------|-----------------|---------|
| product-images | true | 10MB | Product photos |
| blog-images | true | 10MB | Blog images |
| site-assets | true | 50MB | JS, CSS, SVG |
| inquiries | false | 10MB | Attachments |
| documents | false | 50MB | CVs, Contracts |
| lead-files | false | 10MB | Lead attachments |
| catalogs | true | 100MB | PDF catalogs |

---

## 5. PAYMENT INTEGRATION

### Payment Gateways Supported:
- Razorpay
- Stripe
- PayPal
- UPI

### Webhook Endpoint:
**File:** `api/payment-webhook.ts`

Configure in Vercel:
- `POST /api/payment-webhook?type=razorpay`
- `POST /api/payment-webhook?type=stripe`
- `POST /api/payment-webhook?type=paypal`
- `POST /api/payment-webhook?type=upi`

### Environment Variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
ADMIN_SECRET_KEY=saviman_admin_2024
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

---

## 6. TRACKING SYSTEM

### Order Status Values:
1. Order Confirmed
2. Processing
3. Manufacturing
4. Quality Check
5. Dispatched
6. Delivered

### Tracking Endpoint:
```
GET /api/track/:transaction_id
```

### Shipment Tracking Status:
- pending, processing, picked_up, in_transit, out_for_delivery, delivered, failed, returned

---

## 7. ADMIN DASHBOARD

Access: `/admin/login`

### Available Pages:
- `/admin/dashboard` - Analytics overview
- `/admin/products` - Product CRUD
- `/admin/industries` - Industry CRUD
- `/admin/inquiries` - Inquiry management
- `/admin/leads` - Lead management
- `/admin/orders` - Order management
- `/admin/donations` - Donation tracking
- `/admin/shipments` - Shipment tracking
- `/admin/logistics` - Logistics partners
- `/admin/careers` - Jobs & applications
- `/admin/blogs` - Blog management
- `/admin/catalog` - Catalog management
- `/admin/analytics` - Traffic analytics
- `/admin/settings` - Site settings

### Features:
- Search & Filter
- Export CSV/Excel/PDF/DOC
- Revenue charts
- Lead analytics
- Order tracking timeline

---

## 8. COOKIE LEAD INTELLIGENCE

### Service: `VisitorTrackingService`

```typescript
// Initialize session on first visit
await VisitorTrackingService.initSession();

// Track page visits
await VisitorTrackingService.trackPageVisit('/products');

// Update consent
await VisitorTrackingService.updateConsent(true);

// Get current session
const session = await VisitorTrackingService.getSession();
```

### Cookie Name: `antigravit_session`

### Tracked Data:
- Visited pages
- UTM parameters (source, medium, campaign, term, content)
- Device type, browser, OS
- Geolocation (country, city)
- Visit count

---

## 9. AUDIT LOGGING

### Service: `AuditLogService`

```typescript
// Log an action
await AuditLogService.log('create', 'products', productId, null, newValues);
await AuditLogService.log('update', 'orders', orderId, oldValues, newValues);
await AuditLogService.log('delete', 'leads', leadId, oldValues, null);

// Query logs
const logs = await AuditLogService.getRecent(50);
const tableLogs = await AuditLogService.getByTable('orders');
const actorLogs = await AuditLogService.getByActor(userId);
```

---

## 10. RATE LIMITING

Applied to AI Assistant API (`api/ai-assistant.ts`):
- 10 requests per minute per IP

---

## 11. SEO SYSTEM

### Files:
- `public/robots.txt` - Crawler directives
- `public/sitemap.xml` - Full sitemap
- `src/components/SEO.tsx` - Dynamic meta tags

### Features:
- Dynamic meta titles & descriptions
- OpenGraph tags
- JSON-LD schema
- Canonical URLs
- Fast loading images
- robots.txt & sitemap.xml

---

## 12. SECURITY ADDITIONS

- Rate limit forms (10 req/min)
- File size limit (5MB default, configurable per bucket)
- MIME type validation
- Duplicate payment prevention
- Server-side payment verification only
- Encrypted environment variables
- RLS on all tables
- Admin key authentication

---

## 13. UI THEMING

- Bluish-green theme
- Dark + Light mode fully supported
- All content visible (no text merging with background)
- WhatsApp draggable button
- Footer: Designed by SaviTech

---

## 14. KEY SERVICES

### In `src/lib/supabase.ts`:

| Service | Purpose |
|---------|---------|
| `ProductService` | Product CRUD |
| `InquiryService` | Inquiry management |
| `LeadService` | Lead management |
| `VisitorTrackingService` | Cookie tracking |
| `OrderService` | Order management |
| `DonationService` | Donation tracking |
| `AuditLogService` | Audit logging |
| `AnalyticsService` | Event tracking |
| `CMSService` | CMS operations |
| `CMSExportService` | Export to CSV/Excel/PDF/DOC |

---

## 15. API ENDPOINTS

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai-assistant` | POST | AI chatbot |
| `/api/payment-webhook?type=razorpay` | POST | Razorpay webhook |
| `/api/payment-webhook?type=stripe` | POST | Stripe webhook |
| `/api/payment-webhook?type=paypal` | POST | PayPal webhook |
| `/api/payment-webhook?type=upi` | POST | UPI webhook |

---

## 16. QUICK START

1. **Run SQL Schema**: Copy contents of `supabase/production-master-schema.sql` to Supabase SQL Editor

2. **Configure Environment Variables** in `.env.local`:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
ADMIN_SECRET_KEY=saviman_admin_2024
GEMINI_API_KEY=your_gemini_key
```

3. **Deploy to Vercel**: Connect your repository

4. **Access Admin Panel**: `/admin/login`

---

## 17. SCALABILITY FEATURES

- Modular API architecture
- Webhook logging
- Clean code separation
- Production error logging
- Background job support ready
- Database indexes for performance

---

## 18. RESULT

The system is now:
- Enterprise secure with RLS
- Revenue ready with payment integrations
- Lead generating with cookie tracking
- Admin manageable with full CRUD
- Investor presentation ready
- Scalable SaaS infrastructure
