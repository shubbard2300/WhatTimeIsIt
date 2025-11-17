// Test call using direct audio URL (bypassing TwiML endpoint)
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config({ path: '.env.local' });

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

console.log('🎙️ Making test call with DIRECT audio URL...');
console.log('   This bypasses the TwiML endpoint completely\n');

const audioUrl = 'https://what-time-is-7ic9cwsgk-gamecat2300-6951s-projects.vercel.app/audio/what-time-is-it.mp3';

// Create inline TwiML that directly references the audio file
const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${audioUrl}</Play>
</Response>`;

client.calls.create({
  to: '+14153597606',
  from: process.env.TWILIO_FROM_NUMBER,
  // Use inline TwiML instead of fetching from a URL
  twiml: twiml
})
.then(call => {
  console.log('✅ Call initiated successfully!');
  console.log(`   Call SID: ${call.sid}`);
  console.log(`   Audio URL: ${audioUrl}`);
  console.log('\n📞 You should receive a call and hear the audio!');
})
.catch(error => {
  console.error('❌ Error:', error.message);
});
