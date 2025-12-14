# CLINE TASK: Fix Phone Call Delivery Issue

## OBJECTIVE
Fix the production phone call delivery system so that scheduled calls via https://what-time-is-it-amber.vercel.app/ actually reach users' phones.

## ROOT CAUSE
The `PUBLIC_BASE_URL` environment variable is set to `http://localhost:5174` in `.env`, which prevents Twilio from accessing the TwiML endpoint in production. Twilio needs `https://what-time-is-it-amber.vercel.app` to fetch call instructions.

## REQUIRED ACTIONS

### 1. Update .env File
**File:** `.env` (line ~37)
**Change:**
```bash
# FROM:
PUBLIC_BASE_URL="http://localhost:5174"

# TO:
PUBLIC_BASE_URL="https://what-time-is-it-amber.vercel.app"
```

**Note:** Add comment explaining local development requires ngrok

### 2. Verify Vercel Environment Variables
**Action:** Check if these are set in Vercel Dashboard (cannot be done via CLI, must guide user):
- `PUBLIC_BASE_URL` = `https://what-time-is-it-amber.vercel.app`
- `TWILIO_ACCOUNT_SID` = (from .env)
- `TWILIO_AUTH_TOKEN` = (from .env)
- `TWILIO_FROM_NUMBER` = (from .env)
- Database connection strings (POSTGRES_URL, etc.)

**Create a helper script to verify Vercel env vars are set**

### 3. Test the Fix
**Action:** Create a comprehensive test script that:
1. Schedules a test call for 2 minutes in the future
2. Waits for the cron job to process it
3. Checks call status via Twilio API
4. Reports success/failure

### 4. Deploy to Production
**Action:** Commit changes and push to trigger Vercel deployment

## SUCCESS CRITERIA
✅ `.env` file updated with production URL
✅ Vercel environment variables verified
✅ Test call successfully initiated
✅ Phone actually rings within 1 minute of scheduling

## EXECUTION CHECKLIST
- [ ] Update PUBLIC_BASE_URL in .env file
- [ ] Create script to check Vercel env vars
- [ ] Create comprehensive test script
- [ ] Run test locally (if possible)
- [ ] Guide user to verify Vercel Dashboard settings
- [ ] Commit and push changes
- [ ] Run production test
- [ ] Verify phone call received

## FILES TO MODIFY
1. `.env` - Update PUBLIC_BASE_URL
2. New file: `verify-vercel-env.js` - Check Vercel configuration
3. New file: `test-full-flow.js` - End-to-end test

## CONSTRAINTS
- Use `.env` for all environments (user requirement)
- Must work with existing Vercel Cron setup
- No breaking changes to existing code
- All Twilio credentials already exist in .env

## START IMMEDIATELY
