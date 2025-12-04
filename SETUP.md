# Cobb's Crumbs - Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Name it something like "cobbscrumbs"
4. Set a database password (save this somewhere!)
5. Choose a region close to you
6. Wait for the project to be created

## 2. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor and click "Run"
4. This will create all the tables, sample products, and set up storage

## 3. Get Your API Keys

1. In Supabase, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (the long string)
   - **service_role** key (click "Reveal" - keep this secret!)

## 4. Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ADMIN_SESSION_SECRET=any-random-string-you-make-up
```

## 5. Change the Admin Password

The default admin password is `cobbscrumbs2024`. To change it:

1. In Supabase, go to **Table Editor** > **admin_settings**
2. Find the row where `setting_key` is `admin_password`
3. Edit the `setting_value` to your new password

## 6. Run Locally

```bash
cd cobbscrumbs-site
npm install
npm run dev
```

Visit:
- Public site: http://localhost:3000
- Admin login: http://localhost:3000/boss

## 7. Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Option B: Deploy via CLI
```bash
npm install -g vercel
vercel
```

## 8. Set Up Custom Domain with Subdomain

In Vercel:

1. Go to your project **Settings** > **Domains**
2. Add your main domain: `cobbscrumbs.com`
3. Add the subdomain: `boss.cobbscrumbs.com`

Both will work automatically since the `/boss` route exists in the app!

### DNS Settings (at your domain registrar)
Add these records:
- `A` record: `@` pointing to `76.76.21.21`
- `CNAME` record: `boss` pointing to `cname.vercel-dns.com`

## 9. Configure Supabase for Production

1. In Supabase, go to **Settings** > **API**
2. Under "URL Configuration", make sure your Vercel URL is allowed

## Environment Variables for Vercel

In your Vercel project settings, add these environment variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `ADMIN_SESSION_SECRET` | A random secret string |

---

## Quick Reference

**Public Pages:**
- `/` - Homepage
- `/shop` - Product listings

**Admin Pages (password protected):**
- `/boss` - Login
- `/boss/dashboard` - Overview
- `/boss/orders` - Manage orders
- `/boss/products` - Manage products

**Default Admin Password:** `cobbscrumbs2024`

**WhatsApp Number:** 1-226-924-4889

---

## Troubleshooting

### "Failed to fetch products"
- Check that your Supabase URL and anon key are correct
- Make sure you ran the SQL schema

### "Upload failed"
- Check that the `product-images` storage bucket exists
- Verify the storage policies are set up correctly

### Admin login not working
- Check that `admin_settings` table has the password row
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

### Images not loading
- Check `next.config.ts` has the Supabase domain pattern
- Verify the image URL is correct in the database
