// SUPABASE SETUP GUIDE
// =====================

// STEP 1: Go to Supabase Dashboard
// https://supabase.com/dashboard/project/znmzksgligtgokpsrhmw

// STEP 2: Go to SQL Editor (left sidebar)
// Click "New query" and run the contents of supabase-setup.sql

// STEP 3: Get your API keys
// Go to Project Settings → API
// Copy the URL and anon key

// STEP 4: Update .env.local with correct credentials:
// NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
// NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."

// STEP 5: Restart the dev server
// npm run dev

// AFTER SETUP:
// - Login to /admin/login with your Supabase auth credentials
// - Add/Edit projects, skills, and blog posts from admin panel
// - Contact form will save messages to contact_messages table
