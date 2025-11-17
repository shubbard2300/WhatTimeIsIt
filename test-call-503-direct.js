#!/usr/bin/env node

/**
 * Test Call to (503) 778-0815
 * Uses DIRECT TwiML to play Ken Nordine audio
 * This bypasses the broken production endpoint
 */

import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config({ path: '.env.local' });

const PHONE_NUMBER = '+15037780815'; // (503) 778-0815
const AUDIO_URL = 'https://what-time-is-it-amber.vercel.app/audio/what-time-is-it.mp3';

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
  console.log(`🎙️  Audio: Ken Nordine - "What time is it?"`);
  console.log(`🔗 Direct URL: ${AUDIO_URL}`);
  console.log('');
  console.log('ℹ️  Using DIRECT TwiML (bypasses broken endpoint)');
  console.log('');
  
  try {
    // Initialize Twilio client
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    // Create TwiML directly
    const twimlResponse = new twilio.twiml.VoiceResponse();
    twimlResponse.play(AUDIO_URL);
    
    console.log('⏳ Initiating call with direct TwiML...\n');
    console.log('📄 TwiML being sent:');
    console.log('─'.repeat(60));
    console.log(twimlResponse.toString());
    console.log('─'.repeat(60));
    console.log('');
    
    // Create the call with inline TwiML
    const call = await client.calls.create({
      from: TWILIO_FROM_NUMBER,
      to: PHONE_NUMBER,
      twiml: twimlResponse.toString(),
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
    console.log('🎉 The phone should ring at (503) 778-0815 RIGHT NOW!');
    console.log('🎧 When answered, you will hear Ken Nordine ask "What time is it?"');
    console.log('');
    console.log('✅ This test uses DIRECT audio playback - no endpoint needed!');
    console.log('   So you should hear the audio even though the production endpoint is broken.');
    console.log('');
    console.log('📊 To check call status:');
    console.log(`   https://console.twilio.com/us1/monitor/logs/calls/${call.sid}`);
    
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
