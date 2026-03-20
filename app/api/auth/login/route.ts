import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_do_not_use_in_prod');
    const alg = 'HS256';

    const token = await new SignJWT({ id: user._id.toString(), role: user.role })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h') // 1 day
      .sign(secret);

    // Create the response and set the HttpOnly cookie
    const response = NextResponse.json(
      { message: 'Login successful', user: { id: user._id, name: user.name, role: user.role } },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
