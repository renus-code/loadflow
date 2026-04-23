/**
 * ======================================================================================
 * API ROUTE: Cryptographic Credential Rotation (Reset Password)
 * ======================================================================================
 * Executes the final step of the password reset process after admin approval.
 * 
 * Features:
 * 1. Approval Gate: Rejects attempts if the administrator hasn't explicitly flagged `resetPasswordApproved`.
 * 2. Type Guarding: Strictly validates inputs to prevent NoSQL injection via object payloads.
 * 3. State Reset: Clears both `resetPasswordRequested` and `resetPasswordApproved` flags upon success.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { logAction } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email: rawEmail, password, confirmPassword } = body;

    // ── INPUT TYPE GUARD ─────────────────────────────────────────────────────
    if (typeof rawEmail !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
      return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.resetPasswordApproved) {
      return NextResponse.json({ 
        error: 'Password reset has not been approved by an administrator yet.' 
      }, { status: 403 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user.passwordHash = passwordHash;
    user.resetPasswordApproved = false;
    user.resetPasswordRequested = false;
    await user.save();

    // AUDIT LOG PASSWORD RESET SUCCESS
    await logAction({ 
      req, 
      userId: user._id.toString(), 
      action: 'USER_PASSWORD_RESET_SUCCESS', 
      entityType: 'User', 
      entityId: user._id.toString() 
    });

    return NextResponse.json({ 
      message: 'Password reset successful. You can now sign in with your new password.' 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
