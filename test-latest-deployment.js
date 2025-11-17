import 'dotenv/config';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const toNumber = '+14153597606';

// Use the latest deployment URL
const deploymentUrl = 'https://what-time-is-fic3jhyrs-gamecat2300-6951s-projects.vercel.app';

const client = twilio(accountSid, authToken);

console.log('📞 Making test call with latest deployment...');
console.log('   From:', fromNumber);
console.log('   To:', toNumber);
console.log('   TwiML URL:', `${deploymentUrl}/api/twilio/what-time-is-it`);

client.calls
  .create({
    from: fromNumber,
    to: toNumber,
    url: `${deploymentUrl}/api/twilio/what-time-is-it`,
    method: 'POST'
  })
  .then(call => {
    console.log('\n✅ Call initiated successfully!');
    console.log('   Call SID:', call.sid);
    console.log('   Status:', call.status);
    console.log('\n🎙️ You should receive a call and hear Ken Nordine ask "What time is it?"\n');
    console.log('🔍 Testing audio URL availability...');
    console.log('   Audio:', `${deploymentUrl}/audio/what-time-is-it.mp3`);
  })
  .catch(error => {
    console.error('❌ Error making call:', error.message);
    if (error.moreInfo) {
      console.error('   More info:', error.moreInfo);
    }
  });
