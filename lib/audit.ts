/**
 * Audit Logging Helper
 *
 * Provides a simple utility `logAction` to record activity to the AuditLog collection.
 * This should be used in any API route that mutates application state.
 */
/**
 * ======================================================================================
 * UTILITY: Audit Logger
 * ======================================================================================
 * The system's "Black Box" recorder. Tracks every sensitive action in the database.
 * 
 * Features:
 * 1. Action Tracking: Logs who did what, when, and to which entity.
 * 2. Contextual Metadata: Captures IP addresses, User Agents, and specific change details.
 * 3. Non-Blocking: Designed for fast execution to avoid delaying main API responses.
 * ======================================================================================
 */
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import AuditLog from '@/models/AuditLog';

// We reuse the getClientIp from ratelimit so we have consistent IP fetching
function getClientIp(req: NextRequest | undefined): string | undefined {
  if (!req) return undefined;
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}

interface LogActionArgs {
  req?: NextRequest;             // Optional request to capture IP address
  userId: string;                // The user ID performing the action
  action: string;                // Code representing the action (e.g., 'LOAD_CREATED')
  entityType: string;            // The subsystem or model name (e.g., 'Load')
  entityId?: string;             // The specific document affected
  details?: Record<string, any>; // JSON metadata
}

/**
 * Creates an entry in the Audit Log collection.
 * This is fire-and-forget in most cases, but returns the Promise if you want to await it.
 */
export async function logAction(args: LogActionArgs) {
  try {
    const ipAddress = getClientIp(args.req);
    
    // We do not strictly await connecting to DB here because we assume the 
    // calling API route already called `await connectToDatabase()` before getting here.
    
    const log = new AuditLog({
      userId: new mongoose.Types.ObjectId(args.userId),
      action: args.action,
      entityType: args.entityType,
      entityId: args.entityId ? new mongoose.Types.ObjectId(args.entityId) : undefined,
      details: args.details,
      ipAddress: ipAddress,
    });

    await log.save();
  } catch (err) {
    // We swallow the error so an audit log failure doesn't crash the main pipeline
    // But we console.error it for debugging
    console.error('Failed to write Audit Log:', err);
  }
}
