/**
 * ======================================================================================
 * API ROUTE: Notification Hub (/api/notifications)
 * ======================================================================================
 * Orchestrates the real-time delivery of system alerts to authenticated users.
 * 
 * Features:
 * 1. Adaptive Logic: Fetches notifications based on specific User ID and Role.
 * 2. Interaction Tracking: Supports atomic status updates for 'isRead' flags.
 * 3. Security Hardening: Integrated with 'withStability' for connection orchestration.
 * 4. Performant Sync: Optimized for high-frequency polling from the NotificationBell.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import { getUserFromRequest } from '@/lib/auth';
import { withStability } from '@/lib/apiUtils';

export const GET = withStability(async (req: NextRequest) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const includeRead = searchParams.get('all') === 'true';
  const categoryFilter = searchParams.get('category');

  // Build query based on user/role and optional read status
  const query: any = {
    $or: [
      { userId: user.id },
      { targetRole: user.role }
    ]
  };

  if (!includeRead) {
    query.isRead = false;
  }

  if (categoryFilter === 'LOADS') {
    query.message = { $regex: /Load #/i };
  } else if (categoryFilter === 'USERS') {
    query.message = { $regex: /User|Password|Login|Account|Driver Request|Registration|New Driver/i };
  }

  const [notifications, totalCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(query)
  ]);

  return NextResponse.json({
    notifications,
    pagination: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit)
    }
  });
});

export const PATCH = withStability(async (req: NextRequest) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Mark all notifications for this user/role as read
  await Notification.updateMany(
    {
      $and: [
        { isRead: false },
        {
          $or: [
            { userId: user.id },
            { targetRole: user.role }
          ]
        }
      ]
    },
    { isRead: true }
  );

  return NextResponse.json({ message: 'All notifications marked as read' });
});
