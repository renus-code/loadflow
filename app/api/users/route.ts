/**
 * ======================================================================================
 * API ROUTE: Identity Management Registry (/api/users)
 * ======================================================================================
 * Provides a secure interface for managing the system's human resources.
 * 
 * Features:
 * 1. Strategic Privacy: Automatically excludes password hashes from all retrieval operations.
 * 2. Role-Based Visibility: Strictly limited to 'Admin' and 'Dispatcher' personas.
 * 3. Connection Hygiene: Integrated with the MongoDB connection lifecycle.
 * 4. Comprehensive Audit: Facilitates administrative oversight of all registered personnel.
 * ======================================================================================
 */
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
