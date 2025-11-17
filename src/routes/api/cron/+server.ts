import type { RequestHandler } from './$types';
import { getDueReminders, markReminderSent } from '$lib/remindersStore';

export const GET: RequestHandler = async () => {
  const now = new Date();
  const due = getDueReminders(now);

  if (due.length === 0) {
    console.log('Cron: no reminders due at', now.toISOString());
  } else {
    console.log('Cron: processing reminders at', now.toISOString());
  }

  for (const r of due) {
    if (r.channel === 'email') {
      console.log(`👉 WOULD SEND EMAIL to ${r.email}: "What time is it?" (Ken Nordine style)`);
    } else if (r.channel === 'call') {
      console.log(`👉 WOULD CALL ${r.phone}: TwiML at /api/twiml/what-time`);
    }
    markReminderSent(r.id);
  }

  return new Response('ok');
};
