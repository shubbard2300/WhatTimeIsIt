# What Time Is It? 🎙️

A minimal SvelteKit application that schedules phone calls to play Ken Nordine's iconic "What time is it?" audio clip at a future date/time.

Built with modern, production-ready technologies optimized for Vercel deployment, featuring a stunning 1960s Word Jazz album aesthetic.

## 🎨 Design

Inspired by Ken Nordine's legendary Word Jazz album covers - vibrant golden yellows, bold reds, hot pinks, and abstract geometric shapes with authentic vintage grain texture.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see .env.local)
# Get Twilio credentials and create Vercel Postgres database

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

## 📚 Documentation

All detailed documentation has been moved to the `documentation/` folder:

- **[📖 Complete Guide](documentation/README.md)** - Full project overview, tech stack, API routes
- **[⚙️ Setup Instructions](documentation/SETUP.md)** - Detailed local & production setup
- **[🚀 Quick Start Guide](documentation/QUICKSTART.md)** - Get running in 5 minutes

## 🔧 Tech Stack

- **Frontend**: SvelteKit 2.x (Svelte 5)
- **Database**: Vercel Postgres with Drizzle ORM
- **Telephony**: Twilio Voice API
- **Scheduling**: Vercel Cron Jobs
- **Hosting**: Vercel (serverless functions)

## 🎯 Features

- Schedule future phone calls with date/time picker
- Twilio integration for automated outbound calls
- PostgreSQL database for persistent storage
- Cron-based polling system for reliable scheduling
- Beautiful 1960s album art inspired design
- Fully responsive and accessible

## 📝 Environment Variables Required

```env
TWILIO_ACCOUNT_SID     # From Twilio Console
TWILIO_AUTH_TOKEN      # From Twilio Console  
TWILIO_FROM_NUMBER     # Your Twilio voice number
POSTGRES_URL           # Vercel Postgres connection
PUBLIC_BASE_URL        # Your deployed URL
```

## 🎭 Live Demo

Visit the deployed app to schedule your "What time is it?" moment!

## 📄 License

This is a demo application. Ensure you have consent before calling anyone and use only legal, licensed audio.

---

**Built with ❤️ for word-jazz enthusiasts everywhere.**

*"What time is it?"* - Ken Nordine
