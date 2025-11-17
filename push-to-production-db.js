#!/usr/bin/env node

/**
 * Push Database Schema to Production
 * 
 * This script pushes the database schema to the production database
 * using the connection string from .env.local
 */

import dotenv from 'dotenv';
import postgres from 'postgres';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

console.log('🚀 Pushing database schema to production...\n');

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error('❌ Error: No DATABASE_URL or POSTGRES_URL found in environment');
  console.error('   Make sure .env.local is configured with your database connection string');
  process.exit(1);
}

console.log('📦 Database URL configured');
console.log(`   Using: ${databaseUrl.substring(0, 30)}...`);

try {
  // Create a connection
  const client = postgres(databaseUrl);
  
  console.log('\n📋 Creating scheduled_calls table if it doesn\'t exist...');
  
  // Create the table using raw SQL
  await client`
    CREATE TABLE IF NOT EXISTS scheduled_calls (
      id SERIAL PRIMARY KEY,
      to_number VARCHAR(20) NOT NULL,
      scheduled_at TIMESTAMPTZ NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      processed_at TIMESTAMPTZ
    );
  `;
  
  console.log('✅ Table created successfully!');
  
  // Verify the table exists
  const result = await client`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'scheduled_calls';
  `;
  
  if (result.length > 0) {
    console.log('\n✅ Verification successful: scheduled_calls table exists');
    
    // Get column information
    const columns = await client`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'scheduled_calls'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📊 Table structure:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
    });
  }
  
  // Close the connection
  await client.end();
  
  console.log('\n🎉 Production database schema is ready!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure your Vercel project has the same POSTGRES_URL environment variable');
  console.log('   2. Redeploy your app or it will pick up the changes automatically');
  console.log('   3. Test the scheduling functionality on the live site');
  
} catch (error) {
  console.error('\n❌ Error pushing schema:', error.message);
  console.error('\nDetails:', error);
  process.exit(1);
}
