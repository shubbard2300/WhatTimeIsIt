#!/usr/bin/env node

/**
 * Test Production Scheduling API
 * 
 * This script tests the production /api/schedule-call endpoint
 * by scheduling a call for immediate delivery (1 minute from now)
 */

const PRODUCTION_URL = 'https://what-time-is-1p52i4fs6-gamecat2300-6951s-projects.vercel.app';

async function testScheduleCall() {
  const phoneNumber = '+14153597606';
  
  // Schedule for 1 minute from now
  const scheduledTime = new Date(Date.now() + 60 * 1000);
  
  console.log('📞 Testing production schedule-call API...');
  console.log(`   Phone: ${phoneNumber}`);
  console.log(`   Scheduled for: ${scheduledTime.toLocaleString()}`);
  console.log('');
  
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/schedule-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toNumber: phoneNumber,
        scheduledAt: scheduledTime.toISOString(),
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Call scheduled successfully!');
      console.log(`   ID: ${data.id}`);
      console.log(`   Scheduled at: ${data.scheduledAt}`);
      console.log('');
      console.log('🎙️ You should receive a call at +14153597606 in about 1 minute!');
      console.log('   Ken Nordine will ask "What time is it?"');
    } else {
      console.error('❌ Error scheduling call:', data.error);
      console.error('   Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testScheduleCall();
