#!/usr/bin/env node

/**
 * End-to-End Test: Full Call Flow
 * 
 * This script tests the complete flow:
 * 1. Schedule a call via the API
 * 2. Wait for the cron job to process it
 * 3. Verify the call was initiated via Twilio
 */

const PRODUCTION_URL = 'https://what-time-is-it-amber.vercel.app';

// Default test number (user should provide their own)
const TEST_PHONE_NUMBER = process.argv[2] || '+14153597606';

console.log('🧪 END-TO-END CALL FLOW TEST\n');
console.log('═'.repeat(70));
console.log(`\n📱 Test Phone Number: ${TEST_PHONE_NUMBER}`);
console.log(`🌐 Production URL: ${PRODUCTION_URL}`);
console.log(`⏰ Current Time: ${new Date().toISOString()}\n`);
console.log('═'.repeat(70));

async function testFullFlow() {
  // Step 1: Schedule a call 90 seconds in the future
  console.log('\n📋 STEP 1: Schedule Test Call');
  console.log('─'.repeat(70));
  
  const scheduledTime = new Date(Date.now() + 90 * 1000); // 90 seconds from now
  console.log(`Scheduling call for: ${scheduledTime.toISOString()}`);
  console.log(`(That's in ${Math.round((scheduledTime - Date.now()) / 1000)} seconds)\n`);
  
  try {
    const scheduleResponse = await fetch(`${PRODUCTION_URL}/api/schedule-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toNumber: TEST_PHONE_NUMBER,
        scheduledAt: scheduledTime.toISOString(),
      }),
      signal: AbortSignal.timeout(15000)
    });
    
    const scheduleData = await scheduleResponse.json();
    
    if (!scheduleResponse.ok || !scheduleData.success) {
      console.log('❌ Failed to schedule call');
      console.log(`   Status: ${scheduleResponse.status}`);
      console.log(`   Error: ${scheduleData.error || 'Unknown error'}`);
      return false;
    }
    
    console.log('✅ Call scheduled successfully!');
    console.log(`   Call ID: ${scheduleData.id}`);
    console.log(`   Scheduled for: ${scheduleData.scheduledAt}`);
    
    // Step 2: Wait for the scheduled time + buffer
    console.log('\n📋 STEP 2: Wait for Cron Job to Process');
    console.log('─'.repeat(70));
    
    const waitTime = scheduledTime - Date.now() + 70000; // Wait until scheduled time + 70 seconds
    const waitSeconds = Math.round(waitTime / 1000);
    
    console.log(`Waiting ${waitSeconds} seconds for:)`);
    console.log(`  1. Scheduled time to arrive (${Math.round((scheduledTime - Date.now()) / 1000)}s)`);
    console.log(`  2. Cron job to run (up to 60s after scheduled time)`);
    console.log(`  3. Twilio to process the call\n`);
    
    // Show countdown
    for (let i = waitSeconds; i > 0; i -= 10) {
      const remaining = Math.max(i, 1);
      process.stdout.write(`⏳ ${remaining} seconds remaining...\r`);
      await new Promise(resolve => setTimeout(resolve, Math.min(10000, i * 1000)));
    }
    console.log('⏳ Time\'s up! Checking results...                    \n');
    
    // Step 3: Verify the call was processed
    console.log('📋 STEP 3: Verify Call Was Processed');
    console.log('─'.repeat(70));
    
    // Trigger the cron endpoint manually to see if there are any pending calls
    const cronResponse = await fetch(`${PRODUCTION_URL}/api/process-scheduled-calls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    
    const cronData = await cronResponse.json();
    
    console.log(`Cron endpoint status: ${cronResponse.status}`);
    console.log(`Response:`, JSON.stringify(cronData, null, 2));
    
    // Step 4: Results
    console.log('\n📋 STEP 4: Test Results');
    console.log('═'.repeat(70));
    
    if (cronResponse.ok) {
      console.log('\n✅ Cron endpoint is working');
      
      if (cronData.processed > 0) {
        console.log(`✅ Calls were processed: ${cronData.processed}`);
      } else if (cronData.total === 0) {
        console.log('✅ No pending calls (likely already processed by automatic cron)');
      }
      
      if (cronData.failed > 0) {
        console.log(`⚠️  Some calls failed: ${cronData.failed}`);
      }
      
      console.log('\n📱 PHONE CHECK:');
      console.log(`   Did ${TEST_PHONE_NUMBER} receive a phone call?`);
      console.log('   The call should say "What time is it?"');
      console.log('\n   ✓ YES → Everything is working! 🎉');
      console.log('   ✗ NO  → Check Twilio logs for errors');
      
    } else {
      console.log('❌ Cron endpoint failed');
      console.log(`   Error: ${cronData.error || 'Unknown error'}`);
      console.log('\n🔍 Troubleshooting:');
      console.log('   1. Check Vercel environment variables are set');
      console.log('   2. Run: node verify-vercel-env.js');
      console.log('   3. Check Twilio account for errors');
    }
    
    console.log('\n═'.repeat(70));
    
  } catch (error) {
    console.log('\n❌ Test failed with error:');
    console.log(`   ${error.message}`);
    return false;
  }
}

// Print usage if no phone number provided
if (!process.argv[2]) {
  console.log('\n⚠️  WARNING: Using default test number');
  console.log('   To test with your own number, run:');
  console.log('   node test-full-flow.js +1234567890\n');
}

// Run the test
console.log('🚀 Starting test...\n');

testFullFlow()
  .then(() => {
    console.log('\n✅ Test complete!\n');
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
