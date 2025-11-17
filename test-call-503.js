#!/usr/bin/env node

/**
 * Test Call to (503) 778-0815
 * Makes an immediate call with Ken Nordine's "What time is it?" message
 */

require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

const PHONE_NUMBER = '+15037780815'; // (503) 778-0815
const PRODUCTION_URL = 'https://what-time-is-it-amber.vercel.app';

async function makeTestCall() {
  console.log('📞 Testing call to (503) 778-0815\n');
  console.log('═'.repeat(60));
  
  // Verify environment variables
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
  
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.error('❌ Missing Twilio credentials in .env.local');
    console.error('   Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER');
    process.exit(1);
  }
  
  console.log(`📱 From: ${TWILIO_FROM_NUMBER}`);
  console.log(`📱 To: ${PHONE_NUMBER}`);
  console.log(`🎙️  Message: Ken Nordine - "What time is it?"`);
  console.log('');
  
  try {
    // Initialize Twilio client
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    // Create the call
    console.log('⏳ Initiating call...\n');
    
    const call = await client.calls.create({
      from: TWILIO_FROM_NUMBER,
      to: PHONE_NUMBER,
      url: `${PRODUCTION_URL}/api/twilio/what-time-is-it`,
      method: 'POST',
      timeout: 30,
    });
    
    console.log('✅ CALL INITIATED SUCCESSFULLY!\n');
    console.log('─'.repeat(60));
    console.log(`   Call SID: ${call.sid}`);
    console.log(`   Status: ${call.status}`);
    console.log(`   To: ${call.to}`);
    console.log(`   From: ${call.from}`);
    console.log('─'.repeat(60));
    console.log('');
    console.log('🎉 The phone should ring at (503) 778-0815 right away!');
    console.log('🎧 When answered, Ken Nordine will ask "What time is it?"');
    console.log('');
    console.log('📊 To check call status:');
    console.log(`   https://console.twilio.com/us1/monitor/logs/calls/${call.sid}`);
    console.log('');
    console.log('⚠️  NOTE: If the call connects but you hear "application error",');
    console.log('    it means the production deployment endpoint is broken.');
    console.log('    Follow the steps in EMERGENCY_FIX.md to rollback the deployment.');
    
  } catch (error) {
    console.error('❌ FAILED TO INITIATE CALL\n');
    console.error('Error:', error.message);
    
    if (error.code) {
      console.error('Twilio Error Code:', error.code);
    }
    
    if (error.status === 401) {
      console.error('\n💡 This is an authentication error.');
      console.error('   Check your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
    }
    
    if (error.message.includes('phone number')) {
      console.error('\n💡 Phone number issue.');
      console.error('   Make sure TWILIO_FROM_NUMBER is valid and purchased in your Twilio account');
    }
    
    process.exit(1);
  }
}

makeTestCall();
