/**
 * ======================================================================================
 * UTILITY: Auth Helpers
 * ======================================================================================
 * Handles JWT verification and role-based authorization for server-side routes.
 * 
 * Features:
 * 1. Token Verification: Decodes secure HttpOnly cookies.
 * 2. Role Protection: Middleware-like logic to enforce Admin/Dispatcher/Driver access.
 * 3. Identity Resolution: Extracts validated user models from request headers.
 * ======================================================================================
 */
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function getUserFromRequest(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
    );

    const { payload } = await jwtVerify(token, secret);
    
    // Deep token verification against Database
    await dbConnect();
    const dbUser = await User.findById(payload.id).select('tokenVersion name role');
    if (!dbUser || dbUser.tokenVersion !== payload.tokenVersion) {
      return null;
    }

    return { 
      id: payload.id as string, 
      role: dbUser.role as 'Admin' | 'Dispatcher' | 'Driver', 
      name: dbUser.name as string,
      tokenVersion: dbUser.tokenVersion as number 
    };
  } catch (error) {
    return null;
  }
}

export function requireRole(user: { role: string } | null, allowedRoles: string[]) {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
