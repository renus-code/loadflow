import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function getUserFromRequest(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
    );

    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: 'Admin' | 'Dispatcher' | 'Driver' };
  } catch (error) {
    return null;
  }
}

export function requireRole(user: { role: string } | null, allowedRoles: string[]) {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
