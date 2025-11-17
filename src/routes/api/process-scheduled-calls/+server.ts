/**
 * API Route: Process Scheduled Calls
 * POST /api/process-scheduled-calls
 * 
 * This endpoint is called by Vercel Cron to check for due calls and initiate them via Twilio.
 * It queries the database for pending calls, creates Twilio voice calls, and updates status.
 * 
 * Required environment variables:
 * - TWILIO_ACCOUNT_SID: Your Twilio Account SID
 * - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
 * - TWILIO_FROM_NUMBER: Your Twilio voice-enabled phone number (e.g., +1234567890)
 * - POSTGRES_URL: Database connection string (automatically provided by Vercel Postgres)
 * - PUBLIC_BASE_URL: Your deployment URL (e.g., https://your-app.vercel.app)
 */

// Force Node.js runtime for Twilio SDK compatibility (not edge)
export const config = {
  runtime: 'nodejs20.x'
};

import type { RequestHandler } from './$types';
import { fetchDueCalls, markCallProcessing, markCallCompleted, markCallFailed } from '$lib/db/helpers';
import twilio from 'twilio';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ url }) => {
  console.log(`[${new Date().toISOString()}] Processing scheduled calls...`);
  
  // Verify environment variables
  const TWILIO_ACCOUNT_SID = env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM_NUMBER = env.TWILIO_FROM_NUMBER;
  const PUBLIC_BASE_URL = env.PUBLIC_BASE_URL || url.origin;
  
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.error('❌ Missing required Twilio environment variables');
    return new Response(
      JSON.stringify({ 
        error: 'Twilio credentials not configured',
        processed: 0,
        failed: 0
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Initialize Twilio client
  const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  
  // Build the TwiML callback URL (must be publicly accessible)
  const twimlUrl = `${PUBLIC_BASE_URL}/api/twilio/what-time-is-it`;
  
  console.log(`🌐 Using TwiML URL: ${twimlUrl}`);
  
  try {
    // Fetch all due calls from database
    const dueCalls = await fetchDueCalls();
    
    if (dueCalls.length === 0) {
      console.log('✅ No calls due at this time');
      return new Response(
        JSON.stringify({ processed: 0, failed: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`📞 Found ${dueCalls.length} call(s) to process`);
    
    let processedCount = 0;
    let failedCount = 0;
    
    // Process each due call
    for (const call of dueCalls) {
      try {
        // Atomically mark as processing (prevents double-processing if cron overlaps)
        const wasUpdated = await markCallProcessing(call.id);
        
        if (!wasUpdated) {
          // Another process already grabbed this call
          console.log(`⏭️  Call #${call.id} already being processed, skipping`);
          continue;
        }
        
        console.log(`📞 Initiating call #${call.id} to ${call.toNumber}`);
        
        // Create the Twilio call
        // NOTE: Twilio will POST to the URL after the call is answered
        const twilioCall = await twilioClient.calls.create({
          from: TWILIO_FROM_NUMBER,
          to: call.toNumber,
          url: twimlUrl,
          method: 'POST', // Explicitly specify POST method
          timeout: 30, // Ring timeout in seconds
        });
        
        await markCallCompleted(call.id);
        processedCount++;
        
        console.log(`✅ Call #${call.id} initiated successfully (Twilio SID: ${twilioCall.sid})`);
        
      } catch (error) {
        await markCallFailed(call.id);
        failedCount++;
        
        console.error(`❌ Failed to process call #${call.id}:`, error);
      }
    }
    
    console.log(`✅ Batch complete: ${processedCount} processed, ${failedCount} failed`);
    
    return new Response(
      JSON.stringify({ 
        processed: processedCount,
        failed: failedCount,
        total: dueCalls.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Error processing scheduled calls:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process calls',
        processed: 0,
        failed: 0
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Also support GET for easier local testing (just hit the URL in browser)
export const GET: RequestHandler = async (event) => {
  console.log('⚠️  GET request received - calling POST handler');
  return POST(event);
};

// VERCEL CRON CONFIGURATION:
// To enable automatic processing, add this to your vercel.json:
//
// {
//   "crons": [
//     {
//       "path": "/api/process-scheduled-calls",
//       "schedule": "* * * * *"
//     }
//   ]
// }
//
// Schedule options:
// - "* * * * *"        = Every minute (most responsive, higher usage)
// - "*/5 * * * *"      = Every 5 minutes (good balance)
// - "0,15,30,45 * * * *" = Every 15 minutes
//
// For local testing:
// curl -X POST http://localhost:5173/api/process-scheduled-calls
