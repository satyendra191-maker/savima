# SAVIMAN DEPLOYMENT GUIDE

## Deploy to Vercel

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "feat: Complete admin dashboard with leads, logistics, AI chat"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Import your GitHub repo: `satyendra191-maker/savima`
3. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 3: Add Environment Variables
In Vercel project Settings > Environment Variables, add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key (optional)
```

**To get Supabase keys:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy the "Project URL" and "anon public" key

### Step 4: Add Database Tables
1. Go to your Supabase Dashboard > SQL Editor
2. Copy and run the contents of:
   - `supabase/schema.sql`
   - `supabase/schema-additional.sql`  
   - `supabase/complete-schema.sql`

### Step 5: Deploy
Click "Deploy" in Vercel.

---

## Project Structure

```
/src
  /admin           # Admin dashboard pages
    /components    # Reusable UI components
    /pages         # CRUD pages
    /services      # API services
    /hooks         # Custom hooks
  /components      # Frontend components
  /services        # Frontend services
  /utils           # Utilities
  /lib             # Supabase config
  /context         # React contexts
/supabase          # Database schemas
```

## Features Added

1. **Leads Management** - Full CRUD with export
2. **AI Chat Widget** - Lead generation from chat
3. **Logistics Quotes** - Shipping estimates
4. **Mobile Navigation** - Bottom nav for mobile
5. **Export System** - PDF, Excel, CSV, DOC
6. **Analytics Dashboard** - Real Supabase queries
7. **Draggable Widgets** - Floating AI assistant

## Admin Credentials

- URL: https://savimavercel.vercel.app/admin
- Email: satyendra191@gmail.com
- Password: saviman2024
