# Complete Twilio Fix Guide - Application Error + Old Account Cleanup

## 🔴 Critical Issues Identified

1. **HTTP 403 Errors**: Vercel Deployment Protection blocking Twilio webhooks
2. **Old Account Pollution**: Phone number may be configured with old/closed Twilio account
3. **Missing Runtime Config**: Routes could default to edge runtime

## ✅ Complete Fix (3 Steps)

---

## Step 1: Fix Twilio Phone Number Configuration

An old/closed Twilio account might be configured on your Twilio phone number. Here's how to fix it:

### A. Check Your Phone Number Settings

1. Go to [Twilio Console](https://console.twilio.com/)
2. **Verify you're logged into the CORRECT account**:
   - Current Account SID should match what's in your `.env.local` file
   - NOT an old/closed account
   - Check in top-right corner of Twilio Console
3. Go to **Phone Numbers** → **Manage** → **Active Numbers**
4. Click on your phone number

### B. Configure Voice Settings Correctly

In the phone number configuration page:

**Under "Voice & Fax" section:**

1. **A CALL COMES IN** → Set to:
   - ✅ **Webhook**: `https://your-production-url.vercel.app/api/twilio/what-time-is-it`
   - ✅ **HTTP Method**: `POST`
   
   **OR** (if you prefer to leave it empty):
   - Leave blank (we pass the URL directly in `calls.create()`)

2. **If using a TwiML App** (check if "TwiML App" is selected):
   - ❌ **DO NOT use a TwiML App from the old account**
   - ✅ Either switch to "Webhook" mode (recommended)
   - ✅ OR create a new TwiML App in the current account and configure it

3. **PRIMARY HANDLER FAILS** → Leave as default or set to:
   - Your backup URL if needed

4. Click **Save configuration**

### C. Verify No TwiML App Pollution

If your number is using a TwiML App:

1. Go to **Explore Products** → **Voice** → **Manage** → **TwiML Apps**
2. Check if any apps listed belong to the old account
3. If found:
   - Create a new TwiML App in your current account
   - Set Voice URL: `https://your-production-url.vercel.app/api/twilio/what-time-is-it`
   - Set HTTP Method: `POST`
   - Update your phone number to use this NEW TwiML App

**Recommended approach**: Use direct webhook URLs (no TwiML App) for simplicity.

---

## Step 2: Fix Vercel Deployment Protection

This is causing the **HTTP 403 errors** that Twilio reports.

### Instructions:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: **what-time-is-it**
3. Click **Settings** tab
4. Click **Deployment Protection** in left sidebar
5. Under **Production Deployments**:
   - Change to: **Disabled** ⬅️ THIS IS CRITICAL
   - (Alternative: **Only Vercel Authentication**)
6. Click **Save**

✅ **Takes effect immediately** - no redeploy needed!

### Why This Matters:

- Twilio webhooks don't send authentication headers
- Vercel blocks unauthenticated requests with HTTP 403
- This causes Twilio Error 11200: "Got HTTP 403 response"
- Result: "Application error" during calls

---

## Step 3: Verify Vercel Environment Variables

Make sure your **current** Twilio credentials are set in Vercel (not the old ones):

### Required Variables:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+1234567890
PUBLIC_BASE_URL=https://your-production-url.vercel.app
```

### How to Set:

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. **Check each variable**:
   - If it exists with OLD values → Delete and recreate
   - If missing → Add new
3. For each variable:
   - Click **Add New**
   - Name: e.g., `TWILIO_ACCOUNT_SID`
   - Value: Your actual account SID from `.env.local`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**
4. After updating → **Redeploy** your application

### Verify No Old Values:

Search for any old account SIDs in Vercel:
- If you find any old/closed account SIDs → DELETE THEM
- Replace with your current active account SID from `.env.local`

---

## 🧪 Testing After Fixes

### Test 1: Verify Current Account in Use

```bash
# Check your .env.local has current account
cat .env.local | grep TWILIO_ACCOUNT_SID

# Should show your current active account SID (starts with AC)
# NOT an old/closed account
```

### Test 2: Check TwiML Endpoint (After Disabling Protection)

```bash
# Test production endpoint - should return XML, NOT 403
curl https://your-production-url.vercel.app/api/twilio/what-time-is-it
```

**Expected:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>https://your-production-url.vercel.app/audio/what-time-is-it.mp3</Play>
</Response>
```

✅ Status: 200 OK  
❌ Status: 403 Forbidden → Deployment Protection still active!

### Test 3: Make a Live Test Call

```bash
node test-immediate-call.js
```

**Expected Result:**
- ✅ Call connects
- ✅ Ken Nordine audio plays
- ✅ No "application error" message

### Test 4: Check Call Logs for Errors

```bash
node check-call-logs.js
```

**Before fix:**
```
🚨 ERRORS/WARNINGS:
  - [11200] Msg=Got+HTTP+403+response
```

**After fix:**
```
Status: completed
Duration: 4 seconds
(no errors or warnings)
```

---

## 📋 Deployment Checklist

Before deploying, verify:

- [ ] **Twilio Phone Number** uses correct webhook URL (not old TwiML App)
- [ ] **Vercel Deployment Protection** is DISABLED
- [ ] **Vercel Environment Variables** use current active account (not old/closed account)
- [ ] **Code changes** committed and pushed to GitHub
- [ ] **Redeploy** triggered (if env vars changed)
- [ ] **Test call** works without "application error"

---

## 🎯 Summary of All Changes Made

### Code Fixes Applied:

✅ **src/routes/api/process-scheduled-calls/+server.ts**:
- Added `export const config = { runtime: 'nodejs' }` (forces Node.js runtime)
- Added `method: 'POST'` to Twilio call creation
- Enhanced logging for debugging

✅ **src/routes/api/twilio/what-time-is-it/+server.ts**:
- Added `export const config = { runtime: 'nodejs' }` (forces Node.js runtime)
- Enhanced logging for request debugging
- Returns valid TwiML XML with correct Content-Type

### Configuration Fixes Required:

⚠️ **YOU MUST DO THESE MANUALLY:**

1. ❗ **Twilio Console**: Update phone number to use current account (not old one)
2. ❗ **Vercel Dashboard**: Disable Deployment Protection
3. ❗ **Vercel Dashboard**: Verify environment variables use current account

---

## 🐛 Troubleshooting Guide

### Issue: Still getting "Application Error"

**Possible Causes:**
1. ✅ Deployment Protection still enabled → Check Vercel settings
2. ✅ Phone number using old TwiML App → Check Twilio phone number config
3. ✅ Wrong account credentials → Check Vercel env vars match current account
4. ✅ TwiML endpoint returning non-XML → Test endpoint directly with curl

### Issue: Getting HTTP 403 errors

**Cause**: Vercel Deployment Protection is blocking Twilio

**Fix**: 
1. Vercel Dashboard → Settings → Deployment Protection → **Disable**
2. Test immediately (no redeploy needed)

### Issue: Environment variables not loading

**Causes:**
1. Variables set but not deployed → Must redeploy after changing env vars
2. Wrong environment selected → Make sure Production is checked
3. Typo in variable names → Must match exactly (e.g., `TWILIO_FROM_NUMBER`)

### Issue: "Old account" still affecting calls

**Where to Check:**
1. **Twilio Console** → Phone Numbers → Your Number → Voice settings
2. **Vercel Dashboard** → Environment Variables → Check values
3. **Local .env.local** → Verify current account SID

---

## 🔑 Quick Reference: Account Management

**Important**: Always verify you're using your current, active Twilio account credentials:
- Check the Account SID in your `.env.local` file
- Ensure Vercel environment variables match
- Verify Twilio Console shows you're logged into the correct account
- Make sure your phone number is properly configured in the active account

**Action**: Search for any old account references everywhere and replace with current!

---

## 🎉 Expected Behavior After All Fixes

1. User schedules call via web interface
2. Vercel Cron triggers `/api/process-scheduled-calls`
3. Backend creates Twilio call with current account credentials
4. Twilio calls recipient using configured phone number
5. When answered, Twilio POSTs to `/api/twilio/what-time-is-it`
6. ✅ **Vercel allows the request** (Protection disabled!)
7. Endpoint returns valid TwiML XML
8. Twilio plays Ken Nordine mp3
9. ✅ **No "application error"!**

---

## 📞 Need More Help?

Check Twilio error codes:
- Error 11200: HTTP error retrieving TwiML → Usually 403 from Deployment Protection
- Error 11200: HTTP 403 → Definitely Deployment Protection

Check Vercel logs:
```bash
vercel logs --follow
```

Check Twilio call logs:
```bash
node check-call-logs.js
```

---

**Status**: ✅ Code fixes complete. ⚠️ Manual config required (Steps 1-2-3 above).
