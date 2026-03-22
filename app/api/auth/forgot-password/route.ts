import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail } = await req.json();
    const email = rawEmail?.toLowerCase().trim();

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

    return NextResponse.json({ 
      message: 'Password reset request has been sent to the administrator for approval.' 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
