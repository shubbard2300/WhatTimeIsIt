#!/usr/bin/env node

/**
 * Test Call to 415-359-7606
 * Uses DIRECT TwiML to play Ken Nordine audio
 */

import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config({ path: '.env.local' });

const PHONE_NUMBER = '+14153597606'; // 415-359-7606
const AUDIO_URL = 'https://what-time-is-it-amber.vercel.app/audio/what-time-is-it.mp3';

async function makeTestCall() {
  console.log('📞 Testing call to 415-359-7606\n');
  console.log('═'.repeat(60));
  
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
  
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.error('❌ Missing Twilio credentials in .env.local');
    process.exit(1);
  }
  
  console.log(`📱 From: ${TWILIO_FROM_NUMBER}`);
  console.log(`📱 To: ${PHONE_NUMBER}`);
  console.log(`🎙️  Audio: Ken Nordine - "What time is it?"`);
  console.log('');
  
  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
    const twimlResponse = new twilio.twiml.VoiceResponse();
    twimlResponse.play(AUDIO_URL);
    
    console.log('⏳ Initiating call...\n');
    
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
    console.log('🎉 Phone should ring at 415-359-7606 RIGHT NOW!');
    console.log('🎧 Ken Nordine will ask "What time is it?"');
    
  } catch (error) {
    console.error('❌ FAILED TO INITIATE CALL\n');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

makeTestCall();
