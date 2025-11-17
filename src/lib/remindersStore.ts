export type ReminderChannel = 'email' | 'call';

export interface Reminder {
  id: number;
  channel: ReminderChannel;
  email: string | null;
  phone: string | null;
  scheduledAt: Date;
  sent: boolean;
}

let nextId = 1;
const reminders: Reminder[] = [];

export function addReminder(params: {
  channel: ReminderChannel;
  email: string | null;
  phone: string | null;
  scheduledAt: Date;
}): Reminder {
  const reminder: Reminder = {
    id: nextId++,
    channel: params.channel,
    email: params.email,
    phone: params.phone,
    scheduledAt: params.scheduledAt,
    sent: false
  };
  reminders.push(reminder);
  return reminder;
}

export function getDueReminders(now: Date): Reminder[] {
  return reminders.filter((r) => !r.sent && r.scheduledAt <= now);
}

export function markReminderSent(id: number) {
  const r = reminders.find((r) => r.id === id);
  if (r) r.sent = true;
}

export function getAllReminders() {
  return reminders;
}
