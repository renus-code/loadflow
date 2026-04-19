/**
 * ======================================================================================
 * API ROUTE: Session Recovery & Validation (/me)
 * ======================================================================================
 * Synchronizes the client-side auth state with the server's source of truth.
 * 
 * Features:
 * 1. Session Hydration: Reloads the user's profile upon browser refresh or app mount.
 * 2. Token Versioning: Performs a critical mismatch check between JWT and Database.
 * 3. Cache Invalidation: Explicitly disables edge/browser caching for sensitive auth state.
 * 4. Automatic Cleanup: Purges invalid session cookies if revocation is detected.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
    );

    // Verify the JWT
    const { payload } = await jwtVerify(token, secret);

    if (!payload.id) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch the user from the database
    const userDoc = await User.findById(payload.id).select('-passwordHash').lean();

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ─── SESSION REVOCATION CHECK (Token Versioning) ───────────────────────────
    // If the version in the JWT doesn't match the database, the session is revoked.
    // This allows force-logout-all-devices by incrementing the version.
    if (payload.tokenVersion !== undefined && payload.tokenVersion !== (userDoc.tokenVersion || 0)) {
      console.warn(`Revoked session detected for user ${payload.id}. Version mismatch.`);
      
      // Clear the invalid cookie
      const response = NextResponse.json({ error: 'Session revoked' }, { status: 401 });
      response.cookies.set('token', '', { maxAge: 0, path: '/' });
      return response;
    }

    const { _id, ...rest } = userDoc;
    const user = { id: _id.toString(), ...rest };
    
    const response = NextResponse.json({ user }, { status: 200 });
    
    // ─── DISABLE CACHING FOR AUTH STATE ───────────────────────────────────────
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: unknown) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
