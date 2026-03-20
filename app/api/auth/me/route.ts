import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
    );

    // Verify the JWT
    const { payload } = await jwtVerify(token, secret);

    if (!payload.id) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch the user from the database
    const user = await User.findById(payload.id).select('-passwordHash');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
