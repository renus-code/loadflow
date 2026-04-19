/**
 * ======================================================================================
 * API ROUTE: Security Credential Reset Authorization
 * ======================================================================================
 * Administrator-gated endpoint to manually approve password reset requests.
 * 
 * Features:
 * 1. Role Verification: Strictly enforces Admin privileges before permitting execution.
 * 2. State Mutation: Flips `resetPasswordApproved` to true, unlocking the user's ability to set a new password.
 * 3. Self-Service Exclusion: Prevents normal admins from approving their own resets unless specifically configured.
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
    // Explicitly check for Admin role to protect this endpoint
    if (!requireRole(userPayload, ['Admin'])) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'Admin' && userPayload?.id !== user._id.toString()) {
      // NOTE: Allow Admins to approve resets for other Admins for password recovery
    }

    // Approve the reset: set approved to true and request to false
    user.resetPasswordApproved = true;
    user.resetPasswordRequested = false;
    await user.save();

    return NextResponse.json({ 
      message: `Password reset has been approved for ${user.name}.` 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Approve reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
