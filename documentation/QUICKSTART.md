# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Vercel Postgres

1. Go to https://vercel.com/dashboard
2. Create a Postgres database (Storage > Create Database)
3. Copy all environment variables from the `.env.local` tab

## 3. Setup Twilio

1. Sign up at https://www.twilio.com/try-twilio
2. Get your Account SID and Auth Token from console
3. Buy a phone number with Voice capability

## 4. Create `.env.local`

```env
# From Vercel Postgres
POSTGRES_URL="postgresql://..."

# From Twilio
TWILIO_ACCOUNT_SID="ACxxxxxxxx"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_FROM_NUMBER="+15551234567"

# Your app URL
PUBLIC_BASE_URL="http://localhost:5173"
```

## 5. Create Database Tables
```bash
npm run db:push
```

## 6. Run the App
```bash
npm run dev
```

Visit http://localhost:5173 and schedule a call!

## Testing the Cron Job Locally

```bash
# Manually trigger call processing
curl -X POST http://localhost:5173/api/process-scheduled-calls
```

## Deploying to Vercel

```bash
vercel --prod
```

Then:
1. Add environment variables in Vercel Dashboard
2. Connect your Postgres database to the project
3. The cron job will run automatically every minute!

---

For detailed instructions, see [SETUP.md](./SETUP.md)
