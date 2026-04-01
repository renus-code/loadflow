import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest, requireRole } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminPayload = await getUserFromRequest(req);
    // Only Admin can revoke a session
    if (!requireRole(adminPayload, ['Admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    
    await connectToDatabase();
    
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Incrementing tokenVersion instantly invalidates all existing JWTs for this user
    targetUser.tokenVersion = (targetUser.tokenVersion || 0) + 1;
    await targetUser.save();

    // Audit Logging
    await logAction({
      req,
      userId: adminPayload!.id,
      action: 'SESSION_REVOKED',
      entityType: 'User',
      entityId: id,
      details: { email: targetUser.email, newVersion: targetUser.tokenVersion },
    });

    return NextResponse.json({ message: 'User session has been revoked' }, { status: 200 });

  } catch (error: any) {
    console.error('Revoke session error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
