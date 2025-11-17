/**
 * Database Schema for "What Time Is It?" Scheduler
 * 
 * This schema defines the scheduled_calls table to store
 * phone calls scheduled by users for future delivery.
 */

import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * scheduled_calls table
 * 
 * Stores all scheduled phone calls. The cron job queries this table
 * for 'pending' calls that are due, then initiates Twilio calls.
 */
export const scheduledCalls = pgTable('scheduled_calls', {
  // Primary key
  id: serial('id').primaryKey(),
  
  // Recipient phone number in E.164 format (e.g., +15551234567)
  toNumber: varchar('to_number', { length: 20 }).notNull(),
  
  // When the call should be placed (stored in UTC)
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  
  // Status of the call:
  // - 'pending': waiting to be processed
  // - 'processing': currently being initiated (prevents double-processing)
  // - 'completed': successfully placed
  // - 'failed': error occurred
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  
  // When the record was created (UTC)
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  
  // When the call was actually processed (UTC), null if not yet processed
  processedAt: timestamp('processed_at', { withTimezone: true }),
});

export type ScheduledCall = typeof scheduledCalls.$inferSelect;
export type NewScheduledCall = typeof scheduledCalls.$inferInsert;
