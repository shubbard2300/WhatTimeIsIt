/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 * 
 * Using createPool from @vercel/postgres for proper connection pooling
 * in serverless environments.
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createPool } from '@vercel/postgres';
import * as schema from './schema';

// Create a connection pool which is appropriate for serverless
// It will automatically use POSTGRES_URL from environment variables
const pool = createPool();

// Initialize drizzle with the connection pool
export const db = drizzle(pool, { schema });
