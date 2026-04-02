import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { checkRateLimit } from '@/lib/ratelimit';
import Notification from '@/models/Notification';

export async function POST(req: NextRequest) {
  try {
    // ── RATE LIMIT ───────────────────────────────────────────────────────────
    const limitResponse = checkRateLimit(req, { max: 5, windowMs: 60 * 60 * 1000 });
    if (limitResponse) return limitResponse;

    const body = await req.json();
    const { email: rawEmail } = body;

    // ── INPUT TYPE GUARD ─────────────────────────────────────────────────────
    if (typeof rawEmail !== 'string') {
      return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal if user exists.
      return NextResponse.json({ 
        message: 'If this email is registered, a reset request has been sent to the administrator.' 
      }, { status: 200 });
    }

    user.resetPasswordRequested = true;
    user.resetPasswordApproved = false; // Reset approval if it was previously approved but not used
    await user.save();

    // Create a notification for Admins
    try {
      await Notification.create({
        message: `Password reset requested by user: ${user.email} (${user.name})`,
        type: 'WARNING',
        targetRole: 'Admin',
        link: '/dashboard/users'
      });
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
      // Don't fail the entire request if notification fails.
    }

    return NextResponse.json({ 
      message: 'Password reset request has been sent to the administrator for approval.' 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
