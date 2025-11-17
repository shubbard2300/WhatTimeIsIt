/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schema from './schema';

// Create the Drizzle database instance
// This uses the POSTGRES_URL environment variable automatically via @vercel/postgres
export const db = drizzle(vercelSql, { schema });
