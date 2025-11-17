/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createClient } from '@vercel/postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Get the connection string from environment
const connectionString = env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Create a client connection with explicit connection string
const client = createClient({
  connectionString
});

// Create the Drizzle database instance
export const db = drizzle(client, { schema });
