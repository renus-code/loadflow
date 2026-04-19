/**
 * ======================================================================================
 * API ROUTE: Security Check (Password Verification)
 * ======================================================================================
 * Interstitial authentication layer for validating high-stakes actions.
 * 
 * Features:
 * 1. Synchronous Verification: Validates current plaintext passwords against stored bcrypt hashes.
 * 2. Session Hydration: Uses JWT payloads to guarantee request origin.
 * 3. Pre-flight Check: Used before allowing sensitive profile modifications.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-12345');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;

    const { currentPassword } = await req.json();
    if (!currentPassword) return NextResponse.json({ error: 'Password required' }, { status: 400 });

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    
    return NextResponse.json({ isValid: isMatch });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
