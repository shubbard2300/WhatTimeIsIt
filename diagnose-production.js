#!/usr/bin/env node

/**
 * Diagnose Production Deployment Issues
 * 
 * This script checks if:
 * 1. The process-scheduled-calls endpoint is accessible
 * 2. The endpoint can be triggered manually
 * 3. Vercel's environment is properly configured
 */

const PRODUCTION_URL = 'https://what-time-is-it-amber.vercel.app';

async function testProcessEndpoint() {
  console.log('🔍 DIAGNOSING PRODUCTION DEPLOYMENT\n');
  console.log('═'.repeat(60));
  
  // Test 1: Check if endpoint is accessible
  console.log('\n📡 Test 1: Check if /api/process-scheduled-calls is accessible');
  console.log('─'.repeat(60));
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${PRODUCTION_URL}/api/process-scheduled-calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    console.log(`✅ Endpoint responded in ${duration}ms`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ GOOD: Endpoint is working!');
      
      if (data.processed === 0 && data.failed === 0) {
        console.log('   No calls were processed (either no calls scheduled or already processed)');
      } else {
        console.log(`   Processed: ${data.processed}, Failed: ${data.failed}`);
      }
    } else if (response.status === 500) {
      console.log('\n❌ ERROR: Endpoint returned 500 error');
      console.log('   Possible causes:');
      console.log('   - Missing Twilio credentials in Vercel environment variables');
      console.log('   - Database connection issues');
      console.log('   - Runtime configuration error');
    } else {
      console.log(`\n⚠️  WARNING: Unexpected status ${response.status}`);
    }
    
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('❌ TIMEOUT: Endpoint took more than 15 seconds to respond');
      console.log('   This might indicate:');
      console.log('   - Vercel function is hanging');
      console.log('   - Database query is timing out');
      console.log('   - Cold start taking too long');
    } else {
      console.log('❌ NETWORK ERROR:', error.message);
    }
  }
  
  // Test 2: Check if GET is supported (for easier debugging)
  console.log('\n📡 Test 2: Check if GET method works (for debugging)');
  console.log('─'.repeat(60));
  
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/process-scheduled-calls`, {
      method: 'GET',
      signal: AbortSignal.timeout(15000)
    });
    
    const data = await response.json();
    
    if (response.status === 200) {
      console.log('✅ GET method supported (good for debugging)');
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } else {
      console.log('⚠️  GET method returned:', response.status);
    }
    
  } catch (error) {
    console.log('❌ GET test failed:', error.message);
  }
  
  // Test 3: Check schedule-call endpoint
  console.log('\n📡 Test 3: Check if /api/schedule-call works');
  console.log('─'.repeat(60));
  
  try {
    const scheduledTime = new Date(Date.now() + 60 * 1000); // 1 minute from now
    const response = await fetch(`${PRODUCTION_URL}/api/schedule-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toNumber: '+14153597606',
        scheduledAt: scheduledTime.toISOString(),
      }),
      signal: AbortSignal.timeout(15000)
    });
    
    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ Schedule endpoint works!');
      console.log(`   Call ID: ${data.id}`);
      console.log(`   Scheduled for: ${data.scheduledAt}`);
      console.log('\n   → This call should be processed by the cron job within 1 minute');
      console.log('   → Watch your phone at +14153597606 to verify');
    } else {
      console.log('❌ Schedule endpoint failed:', data.error || response.status);
    }
    
  } catch (error) {
    console.log('❌ Schedule test failed:', error.message);
  }
  
  // Summary
  console.log('\n═'.repeat(60));
  console.log('📋 DIAGNOSIS SUMMARY\n');
  console.log('If process-scheduled-calls endpoint is working:');
  console.log('   ✓ The issue is with Vercel Cron configuration');
  console.log('   ✓ Need to check Vercel Dashboard → Cron Jobs');
  console.log('   ✓ Make sure cron jobs are enabled for your deployment');
  console.log('');
  console.log('If endpoint returns 500 error:');
  console.log('   ✓ Check Vercel environment variables');
  console.log('   ✓ Verify TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER');
  console.log('   ✓ Check POSTGRES_URL is set');
  console.log('');
  console.log('If endpoint times out:');
  console.log('   ✓ Check Vercel function logs');
  console.log('   ✓ May need to adjust runtime configuration');
  console.log('═'.repeat(60));
}

testProcessEndpoint();
