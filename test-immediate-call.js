import 'dotenv/config';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const LATEST_DEPLOYMENT = 'https://what-time-is-5x61u80b3-gamecat2300-6951s-projects.vercel.app';

console.log('📞 Making test call with new TwiML endpoint...');
console.log(`   From: ${process.env.TWILIO_FROM_NUMBER}`);
console.log(`   To: +14153597606`);
console.log(`   TwiML URL: ${LATEST_DEPLOYMENT}/api/twilio/what-time-is-it`);
console.log('');

client.calls.create({
  from: process.env.TWILIO_FROM_NUMBER,
  to: '+14153597606',
  url: `${LATEST_DEPLOYMENT}/api/twilio/what-time-is-it`
})
.then(call => {
  console.log('✅ Call initiated successfully!');
  console.log(`   Call SID: ${call.sid}`);
  console.log(`   Status: ${call.status}`);
  console.log('');
  console.log('🎙️ You should receive a call and hear Ken Nordine ask "What time is it?"');
})
.catch(error => {
  console.error('❌ Error:', error.message);
});
