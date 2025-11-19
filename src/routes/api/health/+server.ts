/**
 * Health Check & Diagnostic Endpoint
 * GET /api/health
 * 
 * Returns status of environment variables and database connection
 */

import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      POSTGRES_URL: env.POSTGRES_URL ? '✅ Set' : '❌ Missing',
      TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing',
      TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing',
      TWILIO_FROM_NUMBER: env.TWILIO_FROM_NUMBER ? '✅ Set' : '❌ Missing',
      PUBLIC_BASE_URL: env.PUBLIC_BASE_URL || '❌ Not set (using fallback)',
    },
    database: {
      status: 'unknown',
      error: null
    }
  };

  // Try to test database connection using our actual db connection
  try {
    const { db } = await import('$lib/db/connection');
    const result = await db.execute('SELECT 1 as test' as any);
    diagnostics.database.status = '✅ Connected';
    diagnostics.database.testQuery = 'Success';
  } catch (error: any) {
    diagnostics.database.status = '❌ Failed';
    diagnostics.database.error = error?.message || String(error);
  }

  return new Response(
    JSON.stringify(diagnostics, null, 2),
    { 
      status: 200, 
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      } 
    }
  );
};
