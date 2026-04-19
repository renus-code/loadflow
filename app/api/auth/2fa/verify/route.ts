/**
 * ======================================================================================
 * API ROUTE: 2FA Activation Handshake (Verify)
 * ======================================================================================
 * Validates the user's first TOTP code to permanently enable 2FA on their account.
 * 
 * Features:
 * 1. Synchronous Validation: Uses `otplib` to compare the provided code against the pending secret.
 * 2. Permanent Lock-in: Flips `isTwoFactorEnabled` to true upon successful verification.
 * 3. Audit Integration: Emits a '2FA_SETUP_COMPLETED' event to the system ledger.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'otplib';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(userPayload.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json({ error: '2FA has not been generated yet' }, { status: 400 });
    }

    // Verify the code against the secret (v13 verify is async)
    const result = await verify({ token: code, secret: user.twoFactorSecret });

    if (!result.valid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Mark 2FA as fully enabled
    user.isTwoFactorEnabled = true;
    await user.save();

    await logAction({
      req,
      userId: user.id,
      action: '2FA_SETUP_COMPLETED',
      entityType: 'User',
      entityId: user.id
    });

    return NextResponse.json({ message: '2FA has been successfully enabled' }, { status: 200 });

  } catch (error: unknown) {
    console.error('Verify 2FA error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
