# Fix: Vercel Cron Jobs Not Processing Calls

## 🔴 Problem
Calls are being scheduled successfully in the database, but they're never being sent. This was working a few hours ago.

## 🎯 Most Likely Causes

### 1. **Vercel Cron Jobs are Paused/Disabled** (Most Common)

Vercel can automatically pause cron jobs if:
- Your deployment was recently updated
- You exceeded free tier limits
- There were repeated errors
- You changed deployment settings

#### ✅ FIX: Re-enable Cron Jobs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **what-time-is-it-amber**
3. Click on **Cron Jobs** tab (or look in **Settings**)
4. Check if cron jobs are listed and their status
5. If paused or disabled → Click **Enable** or **Resume**
6. If not visible → May need to **redeploy** to activate them

**Quick Test:**
```bash
# After enabling, wait 1 minute then check your Vercel function logs
# You should see cron job executions
```

---

### 2. **Wrong Production Deployment is Active**

If you have multiple deployments, the cron might be pointing to an old one.

#### ✅ FIX: Set Correct Production Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Deployments** tab
4. Find the latest successful deployment
5. Click the **...** menu → **Promote to Production**
6. Verify the URL matches: `https://what-time-is-it-amber.vercel.app`

---

### 3. **Runtime Configuration Changed**

The process-scheduled-calls endpoint requires Node.js runtime (not Edge).

#### ✅ FIX: Verify Runtime Configuration

Check your code has this at the top of `/src/routes/api/process-scheduled-calls/+server.ts`:

```typescript
export const config = {
  runtime: 'nodejs20.x'
};
```

If missing → Add it and redeploy.

---

### 4. **Environment Variables Missing/Changed**

Recent deployment might have cleared env vars.

#### ✅ FIX: Verify Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Verify these exist with correct values:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER`
   - `PUBLIC_BASE_URL`
   - `POSTGRES_URL` (and other Postgres vars)

5. If any are missing → Add them
6. After adding → **Redeploy** the project (required for env vars to take effect)

---

## 🔧 Quick Diagnosis Commands

### Test 1: Manually Trigger the Cron Job
```bash
# This should work if the endpoint itself is functional
curl -X POST https://what-time-is-it-amber.vercel.app/api/process-scheduled-calls
```

**Expected Response:**
```json
{"processed": 0, "failed": 0}  // If no calls due
{"processed": 1, "failed": 0}  // If calls were processed
```

**If it times out or returns 500:**
- Environment variables are missing
- Database connection is broken
- Runtime configuration issue

### Test 2: Schedule a Test Call
```bash
node test-production-schedule.js
```

This will schedule a call for 1 minute from now. If the cron is working, you'll receive a call within the next 1-2 minutes.

### Test 3: Check Vercel Function Logs
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# View live logs
vercel logs --follow
```

Look for:
- Cron job executions (should happen every minute)
- Error messages from process-scheduled-calls
- Database connection errors

---

## 🎯 Step-by-Step Fix Process

### Step 1: Check Vercel Cron Status
1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to your project
3. Look for **Cron Jobs** section
4. Verify status is **Active** or **Enabled**

### Step 2: Check Recent Deployments
1. Go to **Deployments** tab
2. Look at the most recent deployment
3. Check its status (Success/Failed)
4. Click on it to see logs
5. Look for any errors during build/deployment

### Step 3: Verify Environment Variables
1. **Settings** → **Environment Variables**
2. Check all Twilio and Postgres variables exist
3. Make sure they're enabled for **Production** environment
4. If you changed any → **Redeploy**

### Step 4: Test Manually
```bash
# Schedule a test call
node test-production-schedule.js

# Wait 1-2 minutes

# If no call received, manually trigger the processor
curl -X POST https://what-time-is-it-amber.vercel.app/api/process-scheduled-calls
```

### Step 5: Check Logs
```bash
vercel logs --follow
```

Watch for:
- `Processing scheduled calls...` (from cron)
- `Found X call(s) to process`
- Any error messages

---

## 🚨 Emergency Fix: Force Redeploy

If nothing else works:

```bash
# In your project directory
git commit --allow-empty -m "Force redeploy to fix cron"
git push origin main

# Or use Vercel CLI
vercel --prod
```

This will:
- Rebuild the project
- Re-register cron jobs
- Reset any cached configurations
- Apply all environment variables

---

## 📊 Expected Behavior When Working

1. **Every minute**, Vercel triggers: `/api/process-scheduled-calls`
2. Endpoint queries database for calls where `scheduledAt <= NOW()`
3. For each due call:
   - Marks it as "processing"
   - Creates Twilio call via API
   - Marks as "completed" or "failed"
4. You should see in logs:
   ```
   Processing scheduled calls...
   Found 1 call(s) to process
   Initiating call #123 to +1234567890
   Call #123 initiated successfully
   ```

---

## 🔍 How to Verify Cron is Running

### Method 1: Check Vercel Dashboard
1. Go to your project
2. Click **Logs** or **Functions**
3. Filter by `/api/process-scheduled-calls`
4. You should see entries **every minute**

### Method 2: Check Database
```sql
-- If you have database access
SELECT * FROM scheduled_calls 
WHERE status = 'pending' 
ORDER BY scheduled_at;
```

If calls are stuck as "pending" past their scheduled time → Cron isn't running.

### Method 3: Add a Test Endpoint

Create a simple monitoring endpoint to see last cron run:

```typescript
// src/routes/api/cron-status/+server.ts
export const GET = async () => {
  return new Response(JSON.stringify({
    message: 'Cron monitoring endpoint',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

## 💡 Common Gotchas

### Gotcha 1: Vercel Free Tier Limits
- Free tier has limited function executions
- If you exceed limits, cron jobs may be paused
- Check your usage in Vercel Dashboard

### Gotcha 2: Cold Starts
- First cron after deployment might take longer
- Subsequent runs should be faster
- This is normal Vercel behavior

### Gotcha 3: Deployment Protection
- Make sure Deployment Protection is **Disabled** for production
- (This affects Twilio callbacks, not cron, but good to verify)

### Gotcha 4: Timezone Issues
- Vercel uses UTC timezone
- Make sure scheduled times are stored in UTC
- The `scheduledAt` field should be a UTC timestamp

---

## 📞 Quick Reference

| Issue | Fix |
|-------|-----|
| Cron not running | Re-enable in Vercel Dashboard |
| 500 errors | Check environment variables |
| Timeout errors | Check database connection |
| No logs | Redeploy to register cron |
| Wrong deployment | Promote correct one to production |

---

## ✅ Verification Checklist

After applying fixes:

- [ ] Cron jobs show as "Active" in Vercel Dashboard
- [ ] Latest deployment is promoted to Production
- [ ] Environment variables are all set correctly
- [ ] Manual curl to process-scheduled-calls returns 200 OK
- [ ] Vercel logs show cron executions every minute
- [ ] Test call gets scheduled and received within 1-2 minutes

---

## 🎉 Expected Timeline

Once fixed:
1. **Immediate**: Manual API calls should work
2. **Within 1 minute**: Cron should trigger automatically
3. **Within 2 minutes**: Scheduled calls should be processed

If it takes longer → Check Vercel function logs for errors.

---

## 📝 Notes

- Cron jobs are **not** instant - they run at their scheduled interval
- Your cron is set to `* * * * *` (every minute)
- This means a scheduled call might wait up to 59 seconds before processing
- This is normal behavior

---

**Most likely fix**: Just re-enable cron jobs in Vercel Dashboard or redeploy!
