// Smoke test: Schedule a call to 415-359-7606
import fetch from 'node-fetch';

const API_URL = 'https://what-time-is-it-amber.vercel.app/api/schedule-call';
const TEST_PHONE = '415-359-7606';

// Schedule call for 2 minutes from now
const scheduledTime = new Date();
scheduledTime.setMinutes(scheduledTime.getMinutes() + 2);

async function scheduleTestCall() {
  console.log('🧪 Smoke Test: Scheduling call to', TEST_PHONE);
  console.log('📅 Scheduled for:', scheduledTime.toLocaleString());
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toNumber: TEST_PHONE,
        scheduledAt: scheduledTime.toISOString()
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success! Call scheduled.');
      console.log('Response:', data);
    } else {
      console.error('❌ Failed to schedule call');
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('❌ Error scheduling call:', error.message);
  }
}

scheduleTestCall();
