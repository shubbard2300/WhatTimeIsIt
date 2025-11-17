// Quick test script to make an immediate Twilio call
import dotenv from 'dotenv';
import twilio from 'twilio';

// Load .env.local file
dotenv.config({ path: '.env.local' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_FROM_NUMBER;

console.log('Environment check:');
console.log('- Account SID:', accountSid ? '✓ Set' : '✗ Missing');
console.log('- Auth Token:', authToken ? '✓ Set' : '✗ Missing');
console.log('- From Number:', twilioPhoneNumber || '✗ Missing');
console.log('');

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error('❌ Missing required Twilio environment variables!');
  console.error('Make sure .env.local has TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function makeTestCall() {
  console.log('🎙️ Making test call to +14153597606...');
  
  try {
    const call = await client.calls.create({
      to: '+14153597606',
      from: twilioPhoneNumber,
      // Use the deployed Vercel URL so Twilio can reach it
      url: 'https://what-time-is-7ic9cwsgk-gamecat2300-6951s-projects.vercel.app/api/twilio/what-time-is-it',
    });
    
    console.log('✅ Call initiated successfully!');
    console.log('Call SID:', call.sid);
    console.log('Status:', call.status);
    console.log('\n📞 You should receive a call at +14153597606 shortly!');
    console.log('Or if it goes to voicemail, Ken Nordine will leave a message.');
  } catch (error) {
    console.error('❌ Error making call:', error.message);
    console.error(error);
  }
}

makeTestCall();
