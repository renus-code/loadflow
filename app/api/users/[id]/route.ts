import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest, requireRole } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userPayload = await getUserFromRequest(req);
    const resolvedParams = await params;
    
    if (!requireRole(userPayload, ['Admin']) && userPayload?.id !== resolvedParams.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const user = await User.findById(resolvedParams.id).select('-passwordHash');
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userPayload = await getUserFromRequest(req);
    const resolvedParams = await params;

    if (!requireRole(userPayload, ['Admin'])) {
      return NextResponse.json({ error: 'Forbidden: Only Admins can modify accounts' }, { status: 403 });
    }

    const body = await req.json();
    await connectToDatabase();

    // Prevent non-admins from changing roles
    if (body.role && !requireRole(userPayload, ['Admin'])) {
      delete body.role;
    }
    
    // We shouldn't allow plain text password update here, it would need hashing logic
    delete body.passwordHash;
    delete body.password;

    const user = await User.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true }).select('-passwordHash');
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userPayload = await getUserFromRequest(req);
    const resolvedParams = await params;

    if (!requireRole(userPayload, ['Admin'])) {
      // Only Admins can delete users
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const user = await User.findByIdAndDelete(resolvedParams.id);
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
