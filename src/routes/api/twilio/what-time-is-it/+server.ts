/**
 * API Route: Twilio TwiML Response
 * POST/GET /api/twilio/what-time-is-it
 * 
 * Returns TwiML XML instructions telling Twilio to play the Ken Nordine audio.
 * This URL is provided to Twilio when creating the outbound call.
 * 
 * Audio file: /static/audio/what-time-is-it.mp3
 * 
 * IMPORTANT: This endpoint must be publicly accessible without authentication
 * for Twilio webhooks to work. If using Vercel Deployment Protection, you must
 * disable it or add Twilio IPs to the allowlist.
 */

// Force Node.js runtime (not edge) for compatibility
export const config = {
  runtime: 'nodejs20.x'
};

import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const handleTwiML: RequestHandler = async ({ url, request }) => {
  // Log incoming request for debugging
  console.log(`🎙️ TwiML endpoint called`);
  console.log(`   Method: ${request.method}`);
  console.log(`   Origin: ${url.origin}`);
  console.log(`   User-Agent: ${request.headers.get('user-agent')}`);
  
  // Get the base URL - uses PUBLIC_BASE_URL from env, or falls back to request origin
  const baseUrl = env.PUBLIC_BASE_URL || url.origin;
  
  // Audio file is served from /static/audio/what-time-is-it.mp3
  // SvelteKit automatically serves static files from the /static folder
  const audioUrl = `${baseUrl}/audio/what-time-is-it.mp3`;
  
  console.log(`   Audio URL: ${audioUrl}`);
  
  // TwiML XML response that instructs Twilio to:
  // 1. Answer the call
  // 2. Play the audio file (Ken Nordine's "What time is it?")
  // 3. Call ends automatically when audio finishes
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${audioUrl}</Play>
</Response>`;

  console.log(`   ✅ Returning valid TwiML XML`);

  return new Response(twiml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
  });
};

// Twilio sends POST requests by default
export const POST: RequestHandler = handleTwiML;

// Also support GET for testing
export const GET: RequestHandler = handleTwiML;

// How it works:
// 1. When a scheduled call is due, the cron job calls Twilio API
// 2. Twilio initiates the call to the recipient's phone
// 3. When they answer, Twilio requests this TwiML URL
// 4. This endpoint returns XML with the <Play> instruction
// 5. Twilio plays the audio file to the recipient
// 6. The call ends automatically when the audio finishes
