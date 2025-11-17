// Check Twilio call logs to debug
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config({ path: '.env.local' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function checkRecentCalls() {
  console.log('Fetching recent calls...\n');
  
  try {
    const calls = await client.calls.list({ limit: 3 });
    
    for (const call of calls) {
      console.log('─────────────────────────────────────');
      console.log('Call SID:', call.sid);
      console.log('Status:', call.status);
      console.log('To:', call.to);
      console.log('From:', call.from);
      console.log('Duration:', call.duration, 'seconds');
      console.log('Start Time:', call.startTime);
      
      // Fetch detailed info
      const callDetails = await client.calls(call.sid).fetch();
      console.log('URL Called:', callDetails.url);
      
      // Check for errors
      if (callDetails.status === 'failed' || callDetails.status === 'busy' || callDetails.status === 'no-answer') {
        console.log('❌ Call Status:', callDetails.status);
      }
      
      // Fetch notifications/errors for this call
      try {
        const notifications = await client.calls(call.sid).notifications.list();
        if (notifications.length > 0) {
          console.log('🚨 ERRORS/WARNINGS:');
          notifications.forEach(notif => {
            console.log(`  - [${notif.errorCode}] ${notif.messageText}`);
            console.log(`    Log: ${notif.logLevel}`);
          });
        }
      } catch (e) {
        // Notifications might not be available
      }
      
      console.log('\n');
    }
  } catch (error) {
    console.error('Error fetching calls:', error.message);
  }
}

checkRecentCalls();
