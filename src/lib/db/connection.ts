/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Verify the connection string exists
const connectionString = env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Use the sql helper from @vercel/postgres which handles connection pooling automatically
// This is the recommended approach for serverless environments like Vercel
export const db = drizzle(sql, { schema });
