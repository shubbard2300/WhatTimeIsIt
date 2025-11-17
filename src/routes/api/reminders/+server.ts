import type { RequestHandler } from './$types';
import { addReminder, type ReminderChannel } from '$lib/remindersStore';

interface Body {
  channel: ReminderChannel;
  email: string | null;
  phone: string | null;
  scheduledTime: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { channel, email, phone, scheduledTime } = (await request.json()) as Body;

    if (!channel || !scheduledTime) {
      return new Response('Missing fields', { status: 400 });
    }

    if (channel === 'email' && !email) {
      return new Response('Email required', { status: 400 });
    }
    if (channel === 'call' && !phone) {
      return new Response('Phone required', { status: 400 });
    }

    const scheduledAt = new Date(scheduledTime);
    if (isNaN(scheduledAt.getTime())) {
      return new Response('Invalid time', { status: 400 });
    }

    const reminder = addReminder({
      channel,
      email: channel === 'email' ? email : null,
      phone: channel === 'call' ? phone : null,
      scheduledAt
    });

    console.log('Created reminder:', reminder);
    return new Response('ok');
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
};
