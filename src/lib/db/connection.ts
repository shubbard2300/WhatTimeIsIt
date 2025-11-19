/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 * 
 * The @vercel/postgres `sql` helper automatically reads from process.env.POSTGRES_URL
 * and manages connection pooling, which is ideal for serverless environments.
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Use the sql helper from @vercel/postgres which handles connection pooling automatically
// It will automatically use the POSTGRES_URL environment variable
// This is the recommended approach for serverless environments like Vercel
export const db = drizzle(sql, { schema });
