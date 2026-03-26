import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest, requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(req);
    // Only Admin and Dispatcher should see all users, or maybe just Admin. Requirement: "Admin: Manage all users"
    if (!requireRole(userPayload, ['Admin', 'Dispatcher'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    
    // Return users without password hashes
    const users = await User.find({}).select('-passwordHash');
    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
