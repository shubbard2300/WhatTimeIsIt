/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL (direct/non-pooling connection string)
 * 
 * Using createClient from @vercel/postgres for direct connections
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createClient } from '@vercel/postgres';
import * as schema from './schema';

// Get the connection string from environment
// Vercel Postgres provides POSTGRES_URL as a direct connection string
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Create a client with explicit connection string for direct connections
const client = createClient({
  connectionString
});

// Initialize drizzle with the client
export const db = drizzle(client, { schema });
