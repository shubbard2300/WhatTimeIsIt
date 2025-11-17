# What Time Is It? - Setup Guide

A minimal SvelteKit app that schedules phone calls with Twilio, asking the recipient "What time is it?" at a specific future time.

## 🏗️ Architecture Overview

- **Framework**: SvelteKit (deployed on Vercel)
- **Database**: Vercel Postgres (with Drizzle ORM)
- **Telephony**: Twilio (outbound voice calls)
- **Scheduling**: Vercel Cron (polls database every minute)

### How It Works

1. User enters a phone number and future date/time
2. App stores this in `scheduled_calls` table with status='pending'
3. Vercel Cron hits `/api/process-scheduled-calls` every minute
4. Endpoint checks for due calls and initiates them via Twilio
5. Twilio fetches TwiML from `/api/twilio/what-time-is-it` and plays audio

---

## 📋 Prerequisites

- Node.js 18+ (or 20+)
- A Vercel account (for deployment and Postgres)
- A Twilio account (for phone calls)

---

## 🚀 Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database:
   - Navigate to **Storage** > **Create Database** > **Postgres**
   - Name it (e.g., "whattimeisit-db")
3. Copy the environment variables:
   - Click on your database
   - Go to the **.env.local** tab
   - Copy all `POSTGRES_*` variables

### 3. Set Up Twilio

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get your credentials from the [Console Dashboard](https://console.twilio.com/):
   - **Account SID** (starts with AC...)
   - **Auth Token**
3. Buy a phone number with **Voice** capabilities:
   - Go to **Phone Numbers** > **Buy a Number**
   - Filter by "Voice" capability
   - Buy and note the number (format: +15551234567)

### 4. Configure Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Then fill in your actual values:

```env
# Database (from Vercel Postgres)
POSTGRES_URL="postgresql://..."

# Twilio
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_FROM_NUMBER="+15551234567"

# Public URL (for local testing with ngrok)
PUBLIC_BASE_URL="http://localhost:5173"
```

### 5. Run Database Migrations

Push the schema to your database:

```bash
npm run db:push
```

This creates the `scheduled_calls` table with the following schema:
- `id` (primary key)
- `to_number` (phone number in E.164 format)
- `scheduled_at` (timestamp in UTC)
- `status` (pending/processing/completed/failed)
- `created_at` (timestamp)
- `processed_at` (nullable timestamp)

### 6. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

---

## 🧪 Local Testing

### Test the Frontend

1. Open http://localhost:5173
2. Enter a phone number and future time
3. Submit the form
4. Check the console logs to confirm the call was scheduled

### Test the Scheduler Endpoint (Manual Trigger)

Instead of waiting for the cron job, manually trigger call processing:

```bash
# Using curl
curl -X POST http://localhost:5173/api/process-scheduled-calls

# Or just open in browser
open http://localhost:5173/api/process-scheduled-calls
```

**Note**: For Twilio to actually place calls locally, you need to expose your local server:

1. Install and run [ngrok](https://ngrok.com/):
   ```bash
   ngrok http 5173
   ```

2. Update your `.env.local`:
   ```env
   PUBLIC_BASE_URL="https://your-ngrok-id.ngrok.io"
   ```

3. Now Twilio can reach your local TwiML endpoint

### Test TwiML Endpoint

Visit http://localhost:5173/api/twilio/what-time-is-it

You should see XML output:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>https://example.com/audio/what-time-is-it.mp3</Play>
</Response>
```

---

## 🌍 Production Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

Or use the Vercel Dashboard to connect your Git repository.

### 2. Set Environment Variables in Vercel

Go to your project in the Vercel Dashboard:

1. **Settings** > **Environment Variables**
2. Add each variable:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER`
   - `PUBLIC_BASE_URL` (your deployed URL, e.g., https://your-app.vercel.app)

The `POSTGRES_*` variables are automatically provided if you created the database in your Vercel project.

### 3. Connect Database to Project

In the Vercel Dashboard:

1. Go to your project
2. **Storage** tab
3. **Connect** your Postgres database to the project

### 4. Run Migrations in Production

After deploying and connecting the database, push the schema:

```bash
# Set production environment
vercel env pull .env.production

# Push schema
npm run db:push
```

Or use Vercel's dashboard to run commands in the production environment.

### 5. Verify Cron Job

The `vercel.json` file configures the cron job:

```json
{
  "crons": [
    {
      "path": "/api/process-scheduled-calls",
      "schedule": "* * * * *"
    }
  ]
}
```

After deployment, check:
- **Vercel Dashboard** > **Your Project** > **Cron Jobs**
- You should see the job listed and its execution history

**Schedule Options:**
- `"* * * * *"` - Every minute (most responsive)
- `"*/5 * * * *"` - Every 5 minutes (good balance)
- `"0,15,30,45 * * * *"` - Every 15 minutes

---

## 📁 Project Structure

```
/
├── src/
│   ├── lib/
│   │   └── db/
│   │       ├── schema.ts          # Database schema definition
│   │       ├── connection.ts      # Drizzle DB client
│   │       └── helpers.ts         # DB query helpers
│   └── routes/
│       ├── +page.svelte           # Frontend form
│       └── api/
│           ├── schedule-call/
│           │   └── +server.ts     # POST - schedules a call
│           ├── process-scheduled-calls/
│           │   └── +server.ts     # POST - processes due calls (cron)
│           └── twilio/
│               └── what-time-is-it/
│                   └── +server.ts # GET - returns TwiML XML
├── drizzle.config.ts              # Drizzle configuration
├── vercel.json                    # Vercel cron configuration
├── .env.example                   # Environment variables template
└── SETUP.md                       # This file
```

---

## 🎵 Audio File Setup

The app uses a **placeholder audio URL**. To use your actual Ken Nordine audio:

### Option 1: Store in SvelteKit `/static` folder

1. Create `/static/audio/what-time-is-it.mp3`
2. Update `src/routes/api/twilio/what-time-is-it/+server.ts`:
   ```typescript
   const AUDIO_URL = 'https://your-app.vercel.app/audio/what-time-is-it.mp3';
   ```

### Option 2: Use a CDN or Cloud Storage

Upload to S3, Cloudflare R2, or similar, then use that URL.

**Important**: The URL must be publicly accessible for Twilio to fetch it.

---

## 🔧 Available NPM Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate migration files
npm run db:studio    # Open Drizzle Studio (GUI)

# Code quality
npm run check        # Type check
npm run check:watch  # Type check (watch mode)
```

---

## 🐛 Debugging

### Check Database Records

```bash
npm run db:studio
```

This opens a web UI to browse your database tables.

### View Logs

**Local:**
- Check terminal output where `npm run dev` is running

**Production (Vercel):**
- Dashboard > Your Project > Deployments > [Latest] > Functions

### Common Issues

1. **"Twilio credentials not configured"**
   - Verify env vars are set: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`

2. **"Cannot connect to database"**
   - Verify `POSTGRES_URL` is set correctly
   - For local dev, ensure you've pulled Vercel env vars

3. **Calls not being placed**
   - Check cron job is running in Vercel Dashboard
   - Manually trigger: `curl -X POST https://your-app.vercel.app/api/process-scheduled-calls`
   - Check scheduled_at times are in the past (UTC)

4. **TwiML not loading**
   - Verify `PUBLIC_BASE_URL` is set correctly
   - Ensure `/api/twilio/what-time-is-it` returns valid XML

---

## ⚠️ Production Considerations

**TODO** (marked in code):

1. **Authentication**: Add user login to prevent anonymous scheduling
2. **Rate Limiting**: Prevent abuse (e.g., max 5 calls per user per day)
3. **Recipient Consent**: Verify phone number ownership before scheduling
4. **Phone Number Validation**: Use `libphonenumber-js` for better validation
5. **Monitoring**: Add error tracking (Sentry, LogRocket, etc.)
6. **Cost Management**: Set Twilio spending limits

---

## 📝 License & Legal

- This is a demo/toy application
- Ensure you have **consent** before calling anyone
- Use only **legal, licensed audio** for Ken Nordine's voice
- Comply with TCPA and local telemarketing laws
- Monitor Twilio usage to avoid unexpected charges

---

## 🤝 Support

For issues or questions:
- Check Twilio docs: https://www.twilio.com/docs
- Check Vercel docs: https://vercel.com/docs
- Check Drizzle docs: https://orm.drizzle.team

---

**Happy scheduling! 🎙️ "What time is it?"**
