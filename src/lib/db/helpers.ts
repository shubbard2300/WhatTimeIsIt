/**
 * Database Helper Functions
 * 
 * Provides high-level functions for managing scheduled phone calls.
 */

import { db } from './connection';
import { scheduledCalls, type NewScheduledCall } from './schema';
import { eq, and, lte } from 'drizzle-orm';

/**
 * Insert a new scheduled call into the database
 */
export async function insertScheduledCall(data: {
  toNumber: string;
  scheduledAt: Date;
}): Promise<{ id: number }> {
  const result = await db
    .insert(scheduledCalls)
    .values({
      toNumber: data.toNumber,
      scheduledAt: data.scheduledAt,
      status: 'pending',
    })
    .returning({ id: scheduledCalls.id });
  
  return result[0];
}

/**
 * Fetch all pending calls that are due (scheduled_at <= now)
 * 
 * Includes a small grace window (1 minute) to catch calls slightly
 * delayed by cron timing.
 */
export async function fetchDueCalls() {
  const now = new Date();
  // Add 1 minute grace window to catch slightly delayed calls
  const graceWindow = new Date(now.getTime() + 60 * 1000);
  
  const calls = await db
    .select()
    .from(scheduledCalls)
    .where(
      and(
        eq(scheduledCalls.status, 'pending'),
        lte(scheduledCalls.scheduledAt, graceWindow)
      )
    );
  
  return calls;
}

/**
 * Mark a call as processing (prevents double-processing)
 * Returns true if the status was successfully updated, false otherwise
 */
export async function markCallProcessing(id: number): Promise<boolean> {
  const result = await db
    .update(scheduledCalls)
    .set({ 
      status: 'processing',
      processedAt: new Date()
    })
    .where(
      and(
        eq(scheduledCalls.id, id),
        eq(scheduledCalls.status, 'pending') // Only update if still pending
      )
    )
    .returning({ id: scheduledCalls.id });
  
  return result.length > 0;
}

/**
 * Mark a call as completed
 */
export async function markCallCompleted(id: number): Promise<void> {
  await db
    .update(scheduledCalls)
    .set({ 
      status: 'completed',
      processedAt: new Date()
    })
    .where(eq(scheduledCalls.id, id));
}

/**
 * Mark a call as failed
 */
export async function markCallFailed(id: number): Promise<void> {
  await db
    .update(scheduledCalls)
    .set({ 
      status: 'failed',
      processedAt: new Date()
    })
    .where(eq(scheduledCalls.id, id));
}
