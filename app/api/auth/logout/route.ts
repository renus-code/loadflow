/**
 * ======================================================================================
 * API ROUTE: Session Termination (Logout)
 * ======================================================================================
 * Performs a secure, dual-layer session termination.
 * 
 * Features:
 * 1. Hard Revocation: Increments tokenVersion in MongoDB to instantly invalidate the JWT.
 * 2. Client-Side Clearing: Issues an expired httpOnly cookie to purge the browser session.
 * 3. Atomic Integrity: Ensures all active sessions for the user are revoked upon logout.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // ─── HARD REVOCATION (Server-Side) ─────────────────────────────────────────
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
      );
      
      // Verify token to get user ID
      const { payload } = await jwtVerify(token, secret);
      
      if (payload.id) {
        await connectToDatabase();
        // Increment tokenVersion in the database
        // This instantly invalidates this token (and any other active ones) on the server side
        await User.findByIdAndUpdate(payload.id, { $inc: { tokenVersion: 1 } });
        console.log(`Server-side hard revocation completed for user ${payload.id}`);
      }
    } catch (error) {
      // If token is already invalid/expired, we don't need to do anything server-side
      console.log('Logout: Token already invalid or expired, skipping server-side revocation.');
    }
  }

  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Immediately expire the cookie
    path: '/',
  });

  return response;
}
