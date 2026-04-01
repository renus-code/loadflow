import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getUserFromRequest, requireRole } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Find notification first to check ownership/role
    const notification = await Notification.findById(id);
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Role check: Only allow marking as read if it's either for the specific user
    // or for their role. (Admin can mark anything).
    const isOwner = notification.userId?.toString() === user.id;
    const isTargetRole = notification.targetRole === user.role;
    const isAdmin = user.role === 'Admin';

    if (!isOwner && !isTargetRole && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to mark this notification as read' }, { status: 403 });
    }

    notification.isRead = true;
    await notification.save();

    return NextResponse.json({ message: 'Notification marked as read', notification }, { status: 200 });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Find notification first to check ownership/role
    const notification = await Notification.findById(id);
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Role check: Only allow deleting if it's for the specific user/targetRole (Admin can delete anything).
    const isOwner = notification.userId?.toString() === user.id;
    const isTargetRole = notification.targetRole === user.role;
    const isAdmin = user.role === 'Admin';

    if (!isOwner && !isTargetRole && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this notification' }, { status: 403 });
    }

    await notification.deleteOne();

    return NextResponse.json({ message: 'Notification deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

