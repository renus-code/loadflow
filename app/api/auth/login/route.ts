// Login API: Checks passwords and sets a secure login cookie.
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const MAX_ATTEMPTS = 3; // Lock after 3 failed attempts

export async function POST(req: Request) {
  try {
    const { email: rawEmail, password } = await req.json();
    const email = rawEmail?.toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // ── LOCKOUT CHECK ────────────────────────────────────────────────────────
    if (user.isLocked) {
      return NextResponse.json(
        {
          error: 'Account is locked',
          locked: true,
          message:
            'Your account has been locked due to too many failed login attempts. Please contact an administrator to unlock your account, or submit a password reset request.',
        },
        { status: 403 }
      );
    }

    // ── PASSWORD CHECK ───────────────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const newAttempts = (user.loginAttempts || 0) + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        // Lock the account
        await User.findByIdAndUpdate(user._id, {
          loginAttempts: newAttempts,
          isLocked: true,
        });
        return NextResponse.json(
          {
            error: 'Account locked',
            locked: true,
            message: `Account locked after ${MAX_ATTEMPTS} failed attempts. Contact your administrator to unlock it.`,
          },
          { status: 403 }
        );
      }

      // Increment attempt counter
      await User.findByIdAndUpdate(user._id, { loginAttempts: newAttempts });
      const remaining = MAX_ATTEMPTS - newAttempts;
      return NextResponse.json(
        {
          error: `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before account lockout.`,
        },
        { status: 401 }
      );
    }

    // ── SUCCESS — reset attempt counter ──────────────────────────────────────
    await User.findByIdAndUpdate(user._id, { loginAttempts: 0, isLocked: false });

    // Generate JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
    );
    const token = await new SignJWT({ id: user._id.toString(), role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json(
      { message: 'Login successful', user: { id: user._id, name: user.name, role: user.role } },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
