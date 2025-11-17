# What Time Is It?

A tiny word-jazz reminder app in the style of Ken Nordine. A philosophical take on time and reminders.

## What Time Is It? (Local Dev)

- Run: `npm install` and then `npm run dev`
- Open `http://localhost:5173`
- Schedule a reminder 1–2 minutes in the future
- After the time passes, visit `http://localhost:5173/api/cron` in the browser
- Check the dev server logs to see which reminders would send an email or make a call
- TwiML for the call is at `http://localhost:5173/api/twiml/what-time`

## Features

- **Local-only**: No external services (no Twilio, Resend, or Postgres)
- **In-memory storage**: Reminders stored in memory (reset on server restart)
- **Email or phone reminders**: Choose your preferred channel
- **TwiML endpoint**: Returns a Ken Nordine–style contemplative script
- **Cron-like endpoint**: Manually trigger to check for due reminders

## Development

This is a SvelteKit TypeScript project. All reminders are stored in memory and will be lost when the dev server restarts.
