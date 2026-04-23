/**
 * ======================================================================================
 * API ROUTE: User Entity Management (/api/users/[id])
 * ======================================================================================
 * Orchestrates granular control over individual user accounts and security profiles.
 * 
 * Features:
 * 1. Self-Service Logic: Users can view their own data; Admins have global oversight.
 * 2. Immutable Protection: Specifically blocks unauthorized role escalation or password tampering.
 * 3. Atomic Integrity: Implements version-checked updates (__v) to prevent race conditions.
 * 4. Safety Constraints: Hard-coded protection preventing the deletion of Admin accounts.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest, requireRole } from '@/lib/auth';
import { logAction } from '@/lib/audit';

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

    const user = await User.findById(resolvedParams.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Restriction: Admins cannot edit other Admins
    if (user.role === 'Admin' && userPayload?.id !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden: Admins can only edit their own account' }, { status: 403 });
    }

    // Update fields from body
    Object.keys(body).forEach((key) => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        user[key] = body[key];
      }
    });

    // Explicitly check for version mismatch if __v is provided in the body
    if (body.__v !== undefined && user.__v !== body.__v) {
      return NextResponse.json({ error: 'Data has been modified by another user. Please refresh.' }, { status: 409 });
    }

    await user.save();
    
    // AUDIT LOG USER UPDATE
    await logAction({ 
      req, 
      userId: userPayload!.id, 
      action: 'USER_UPDATED', 
      entityType: 'User', 
      entityId: resolvedParams.id,
      details: { updatedFields: Object.keys(body) }
    });

    // Return user without passwordHash
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error: any) {
    if (error.name === 'VersionError') {
      return NextResponse.json({ error: 'Data has been modified by another user. Please refresh.' }, { status: 409 });
    }
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
    const user = await User.findById(resolvedParams.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Restriction: Admins cannot delete any Admin account
    if (user.role === 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin accounts cannot be deleted' }, { status: 403 });
    }

    await User.findByIdAndDelete(resolvedParams.id);
    
    // AUDIT LOG USER DELETION
    await logAction({ 
      req, 
      userId: userPayload!.id, 
      action: 'USER_DELETED', 
      entityType: 'User', 
      entityId: resolvedParams.id,
      details: { deletedUserEmail: user.email }
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
