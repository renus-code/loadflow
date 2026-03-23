import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    if (user.role === 'Admin') {
      return NextResponse.json({ 
        error: 'Admin accounts cannot be registered here. Please contact the system administrator.' 
      }, { status: 403 });
    }

    // Return the role even if they are not pending, 
    // but the registration page only cares if they are pending.
    return NextResponse.json({ 
      role: user.role, 
      isPending: user.isPending,
      name: user.name 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Check email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
