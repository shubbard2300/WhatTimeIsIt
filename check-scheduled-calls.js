// Check scheduled calls in database
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { scheduledCalls } from './src/lib/db/schema.ts';
import { desc } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

async function checkScheduledCalls() {
  console.log('Fetching scheduled calls...\n');
  
  try {
    const calls = await db
      .select()
      .from(scheduledCalls)
      .orderBy(desc(scheduledCalls.createdAt))
      .limit(5);
    
    console.log(`Found ${calls.length} scheduled calls:\n`);
    
    for (const call of calls) {
      console.log('─────────────────────────────────────');
      console.log('ID:', call.id);
      console.log('Phone:', call.phoneNumber);
      console.log('Scheduled For:', call.scheduledFor);
      console.log('Status:', call.status);
      console.log('Twilio SID:', call.twilioCallSid || 'Not yet called');
      console.log('Created At:', call.createdAt);
      console.log('');
    }
  } catch (error) {
    console.error('Error fetching scheduled calls:', error.message);
  } finally {
    await client.end();
  }
}

checkScheduledCalls();
