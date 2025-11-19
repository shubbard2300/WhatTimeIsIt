/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 * 
 * Using @vercel/postgres which automatically reads from 
 * process.env.POSTGRES_URL and manages connection pooling.
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Initialize drizzle with the sql client from @vercel/postgres
// The sql client automatically uses POSTGRES_URL from environment variables
export const db = drizzle(sql, { schema });
