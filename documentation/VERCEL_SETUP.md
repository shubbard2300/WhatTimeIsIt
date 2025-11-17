# Vercel Production Environment Setup

## Issue
The production API is returning "Internal server error" because the database environment variables are not configured in Vercel.

## Solution

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `what-time-is-it`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables (these are from your local `.env.local`):

#### Required Environment Variables:

```bash
# Database Connection
DATABASE_URL=your-postgres-connection-url-from-vercel

POSTGRES_URL=your-postgres-connection-url-from-vercel

# Twilio Credentials (get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token-here
TWILIO_FROM_NUMBER=+1XXXXXXXXXX

# Public URL (use your actual Vercel deployment URL)
PUBLIC_BASE_URL=https://your-app.vercel.app
```

**Note:** Copy your actual values from:
- Database: Vercel Dashboard → Storage → Your Database → .env.local tab
- Twilio: https://console.twilio.com → Account Info section

### Step 2: Environment Scope
For each variable:
- Check **Production**, **Preview**, and **Development** (or just Production for now)

### Step 3: Redeploy
After adding the environment variables:
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

OR simply push a new commit:
```bash
git commit --allow-empty -m "Trigger Vercel redeploy with env vars"
git push origin master
```

### Step 4: Test Again
Once redeployed, run:
```bash
node test-production-schedule.js
```

## Current Status
- ✅ Database table `scheduled_calls` exists in production database
- ✅ Code is deployed to Vercel
- ❌ Environment variables not yet configured in Vercel
- ⏳ Waiting for env vars to be added

## Quick Commands
```bash
# Test local call
node test-call.js

# Check call logs
node check-call-logs.js

# Test production scheduling
node test-production-schedule.js
```
