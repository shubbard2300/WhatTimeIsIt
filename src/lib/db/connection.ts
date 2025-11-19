/**
 * Database Connection Setup
 * 
 * Uses Vercel Postgres with Drizzle ORM.
 * Environment variable required: POSTGRES_URL
 * 
 * Using createClient from @vercel/postgres for direct connections
 * (POSTGRES_URL is a direct/non-pooling connection string)
 */

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createClient } from '@vercel/postgres';
import * as schema from './schema';

// Create a client for direct connections
// It will automatically use POSTGRES_URL from environment variables
const client = createClient();

// Initialize drizzle with the client
export const db = drizzle(client, { schema });
