/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 * 
 * Using @vercel/postgres sql helper which automatically reads from 
 * process.env.POSTGRES_URL and manages connection pooling.
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Pass the sql client and schema to drizzle
// The sql helper will automatically use POSTGRES_URL from environment
export const db = drizzle(sql, { schema });
