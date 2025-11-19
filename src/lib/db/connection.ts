/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 * 
 * The drizzle() function with { schema } will automatically use the 
 * default @vercel/postgres sql helper which reads from process.env.POSTGRES_URL
 * and manages connection pooling, which is ideal for serverless environments.
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

// Call drizzle with just the schema config
// It will automatically use the @vercel/postgres sql helper and POSTGRES_URL env var
export const db = drizzle({ schema });
