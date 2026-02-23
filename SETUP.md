# SAVIMAN - Environment Variables Setup

## Current Status
✅ Deployed: https://antigravit-opencode.vercel.app

❌ Missing: Supabase Environment Variables

---

## What You Need To Do:

### Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

---

### Step 2: Add to Vercel

Go to: https://vercel.com/satyendra-yadavas-projects/antigravit-opencode/settings/environment-variables

Add these 2 variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Your anon key |

---

### Step 3: Run Database Schema

Go to your Supabase Dashboard → **SQL Editor** and run:

**File:** `supabase/FULL-COMPLETE.sql`

---

### Step 4: Redeploy

After adding env vars, go to Vercel Deployments and **Retry** the latest deployment.

---

## Admin Login
- URL: https://antigravit-opencode.vercel.app/admin
- Email: `satyendra191@gmail.com`
- Password: `saviman2024`
