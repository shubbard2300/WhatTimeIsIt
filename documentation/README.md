# What Time Is It? 🎙️

A minimal SvelteKit application that schedules phone calls to play Ken Nordine's iconic "What time is it?" audio clip at a future date/time.

## Overview

This app demonstrates a complete end-to-end scheduled phone call system:

1. **User enters** a friend's phone number and future date/time
2. **Server stores** the scheduled call in a PostgreSQL database
3. **Vercel Cron** checks every minute for due calls
4. **Twilio places** the voice call and plays the audio clip

Built with modern, production-ready technologies optimized for Vercel deployment.

## Tech Stack

- **Frontend**: SvelteKit 2.x (Svelte 5)
- **Database**: Vercel Postgres with Drizzle ORM
- **Telephony**: Twilio Voice API
- **Scheduling**: Vercel Cron Jobs
- **Hosting**: Vercel (serverless functions)

## Quick Start

See **[SETUP.md](./SETUP.md)** for complete setup instructions.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Then edit .env.local with your Twilio and Postgres credentials

# 3. Push database schema
npm run db:push

# 4. Start development server
npm run dev
```

Visit http://localhost:5173 to use the app.

## Required Environment Variables

```env
# Vercel Postgres
POSTGRES_URL="postgresql://..."

# Twilio
TWILIO_ACCOUNT_SID="ACxxxxxxxx"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_FROM_NUMBER="+15551234567"

# App URL (for Twilio callbacks)
PUBLIC_BASE_URL="https://your-app.vercel.app"
```

## Project Structure

```
src/
├── lib/db/
│   ├── schema.ts       # Database schema (scheduled_calls table)
│   ├── connection.ts   # Drizzle DB client
│   └── helpers.ts      # CRUD operations
├── routes/
│   ├── +page.svelte    # Frontend form
│   └── api/
│       ├── schedule-call/           # POST - creates scheduled call
│       ├── process-scheduled-calls/ # POST - cron endpoint
│       └── twilio/what-time-is-it/  # GET - TwiML response
```

## How Scheduling Works

Instead of complex job queues, this uses a simple polling pattern:

1. **Store future calls** in `scheduled_calls` table with `scheduled_at` timestamp
2. **Cron job runs every minute** hitting `/api/process-scheduled-calls`
3. **Query for due calls**: `WHERE status='pending' AND scheduled_at <= NOW()`
4. **Initiate Twilio calls** for each due record
5. **Mark as completed** to prevent re-processing

This is simple, reliable, and works perfectly with Vercel's cron infrastructure.

## Database Schema

```sql
CREATE TABLE scheduled_calls (
  id SERIAL PRIMARY KEY,
  to_number VARCHAR(20) NOT NULL,      -- E.164 format phone number
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL,         -- pending/processing/completed/failed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);
```

## API Routes

### POST `/api/schedule-call`

Schedule a new call.

**Request:**
```json
{
  "toNumber": "+15551234567",
  "scheduledAt": "2025-11-17T15:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "id": 1,
  "scheduledAt": "2025-11-17T15:30:00.000Z"
}
```

### POST `/api/process-scheduled-calls`

Check for and process due calls (triggered by Vercel Cron).

**Response:**
```json
{
  "processed": 3,
  "failed": 0,
  "total": 3
}
```

### GET `/api/twilio/what-time-is-it`

Returns TwiML instructions for Twilio.

**Response:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>https://example.com/audio/what-time-is-it.mp3</Play>
</Response>
```

## Deployment

Deploy to Vercel with one command:

```bash
vercel --prod
```

Or connect your GitHub repo in the Vercel Dashboard for automatic deployments.

**Important**: After deploying:
1. Set environment variables in Vercel Dashboard
2. Connect Vercel Postgres database to your project
3. Run `npm run db:push` to create tables
4. Verify cron job is active in Dashboard > Cron Jobs

## Testing Locally

### Test Scheduling
```bash
# Start dev server
npm run dev

# Open browser and schedule a call
open http://localhost:5173
```

### Test Cron Processor
```bash
# Manually trigger processing
curl -X POST http://localhost:5173/api/process-scheduled-calls
```

### Test with Real Twilio Calls

For Twilio to reach your local server, use [ngrok](https://ngrok.com/):

```bash
# Expose local server
ngrok http 5173

# Update .env.local with ngrok URL
PUBLIC_BASE_URL="https://abc123.ngrok.io"
```

## Vercel Cron Configuration

The cron job is configured in `vercel.json`:

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

This runs every minute. Adjust the schedule as needed:
- `"* * * * *"` = Every minute
- `"*/5 * * * *"` = Every 5 minutes
- `"0 * * * *"` = Every hour

## Safety & Production TODO

⚠️ This is a minimal implementation. For production use:

- [ ] Add **authentication** (prevent anonymous scheduling)
- [ ] Add **rate limiting** (prevent abuse)
- [ ] Implement **recipient consent** verification
- [ ] Use `libphonenumber-js` for better phone validation
- [ ] Add **monitoring** (Sentry, DataDog, etc.)
- [ ] Set **Twilio spending limits**
- [ ] Implement **GDPR compliance** (data retention, deletion)
- [ ] Add **error notifications** (email/Slack alerts)

## Audio File

The app uses a **placeholder audio URL**. To use the actual Ken Nordine audio:

1. Obtain **legal, licensed** audio
2. Place in `/static/audio/what-time-is-it.mp3`
3. Update `AUDIO_URL` in `src/routes/api/twilio/what-time-is-it/+server.ts`

Or host on a CDN/cloud storage and reference that URL.

## Cost Considerations

- **Vercel**: Free tier includes cron jobs
- **Vercel Postgres**: Free tier = 256 MB storage, 60 hours compute/month
- **Twilio**: ~$0.013/minute for outbound calls + phone number rental (~$1/month)

Monitor usage carefully to avoid unexpected charges.

## License & Legal

- Ensure you have **consent** before calling anyone
- Comply with **TCPA** and local telemarketing laws
- Use only **legal, licensed audio**
- This is a **demo application** - not for commercial use without proper licensing

## Contributing

This is a minimal demo app. Feel free to fork and extend with:
- Email scheduling (in addition to calls)
- Custom messages/TTS
- Admin dashboard
- Analytics
- Multi-user support

## Troubleshooting

See **[SETUP.md](./SETUP.md)** for detailed debugging steps.

Common issues:
- Missing environment variables
- Database connection errors
- Twilio API authentication failures
- TwiML URL not accessible

## Links

- [Twilio Voice API Docs](https://www.twilio.com/docs/voice)
- [Vercel Cron Jobs Docs](https://vercel.com/docs/cron-jobs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [SvelteKit Docs](https://kit.svelte.dev/)

---

**Built with ❤️ for word-jazz enthusiasts everywhere.**

*"What time is it?"* - Ken Nordine
