/**
 * Database Connection Setup
 * 
 * Uses Postgres.js with Drizzle ORM for Vercel Postgres.
 * Environment variable required: POSTGRES_URL
 * 
 * Using postgres package which works perfectly with Vercel's direct connection strings
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get the connection string from environment
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Create postgres client - works with both pooled and direct connection strings
const client = postgres(connectionString, {
  max: 1, // Limit connections in serverless environment
  idle_timeout: 20,
  connect_timeout: 10
});

// Initialize drizzle with the postgres client
export const db = drizzle(client, { schema });
