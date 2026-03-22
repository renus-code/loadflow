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

    const user = await User.findByIdAndUpdate(
      id,
      { isLocked: false, loginAttempts: 0 },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Account unlocked successfully', user });
  } catch (error) {
    console.error('Unlock error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
