/**
 * ======================================================================================
 * API ROUTE: Security Lockout Override (Unlock Account)
 * ======================================================================================
 * Administrator-gated endpoint to restore access to accounts locked due to brute-force attempts.
 * 
 * Features:
 * 1. State Reset: Clears the `isLocked` boolean and resets `loginAttempts` to 0.
 * 2. Cross-Admin Prevention: Hardcodes logic preventing Admins from unlocking other Admins to enforce separation of duties.
 * 3. Immediate Efficacy: Allows the target user to attempt login immediately upon success.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest, requireRole } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!requireRole(userPayload, ['Admin'])) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Restriction: Admins cannot unlock other Admins
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (targetUser.role === 'Admin' && userPayload?.id !== targetUser._id.toString()) {
      return NextResponse.json({ error: 'Forbidden: Admins cannot unlock other Admin accounts' }, { status: 403 });
    }

    targetUser.isLocked = false;
    targetUser.loginAttempts = 0;
    await targetUser.save();

    return NextResponse.json({ message: 'Account unlocked successfully', user: targetUser });
  } catch (error) {
    console.error('Unlock error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
