/**
 * API Route: Schedule Call
 * POST /api/schedule-call
 * 
 * Accepts a phone number and scheduled time, validates the data,
 * and inserts a new scheduled call into the database.
 * 
 * Required environment variables: POSTGRES_URL (or Vercel Postgres env vars)
 */

import type { RequestHandler } from './$types';
import { insertScheduledCall } from '$lib/db/helpers';

// Maximum days in the future to allow scheduling (prevents abuse)
const MAX_DAYS_IN_FUTURE = 30;

interface RequestBody {
  toNumber: string;
  scheduledAt: string; // ISO string from client
}

/**
 * Normalize phone number to E.164 format
 * This is a simple implementation - for production, consider using a library like libphonenumber-js
 */
function normalizePhoneNumber(phone: string): string | null {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check basic length (at least 10 digits)
  if (digits.length < 10) {
    return null;
  }
  
  // If it starts with 1 and has 11 digits (US format), use as-is
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If it has 10 digits, assume US and prepend +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // If it starts with + already, validate and return
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Otherwise, prepend + and hope it's valid
  return `+${digits}`;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as RequestBody;
    
    // Validate required fields
    if (!body.toNumber || !body.scheduledAt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: toNumber and scheduledAt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Normalize and validate phone number
    const normalizedPhone = normalizePhoneNumber(body.toNumber);
    if (!normalizedPhone) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format. Please use a valid phone number.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse and validate scheduled time
    const scheduledAt = new Date(body.scheduledAt);
    if (isNaN(scheduledAt.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid date/time format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate not in the past (with 5-minute grace for timezone issues)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    if (scheduledAt < fiveMinutesAgo) {
      return new Response(
        JSON.stringify({ error: 'Cannot schedule calls in the past' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate not too far in the future
    const maxFuture = new Date(now.getTime() + MAX_DAYS_IN_FUTURE * 24 * 60 * 60 * 1000);
    if (scheduledAt > maxFuture) {
      return new Response(
        JSON.stringify({ error: `Cannot schedule calls more than ${MAX_DAYS_IN_FUTURE} days in the future` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert into database
    const result = await insertScheduledCall({
      toNumber: normalizedPhone,
      scheduledAt: scheduledAt,
    });
    
    console.log(`✅ Scheduled call #${result.id} to ${normalizedPhone} at ${scheduledAt.toISOString()}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: result.id,
        scheduledAt: scheduledAt.toISOString() 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error scheduling call:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// TODO: In production, add:
// - Authentication to prevent anonymous scheduling
// - Rate limiting to prevent abuse
// - Recipient consent/opt-in verification
// - Better phone number validation (use libphonenumber-js)
