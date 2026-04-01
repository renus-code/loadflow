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
    const dbUser = await User.findById(payload.id).select('tokenVersion');
    if (!dbUser || dbUser.tokenVersion !== payload.tokenVersion) {
      return null;
    }

    return payload as { id: string; role: 'Admin' | 'Dispatcher' | 'Driver'; tokenVersion: number };
  } catch (error) {
    return null;
  }
}

export function requireRole(user: { role: string } | null, allowedRoles: string[]) {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
