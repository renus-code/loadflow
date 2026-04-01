import { NextRequest, NextResponse } from 'next/server';
import { generateSecret, generateURI } from 'otplib';
import QRCode from 'qrcode';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(userPayload.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isTwoFactorEnabled) {
      return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 });
    }

    // Generate a secure secret
    const secret = generateSecret();
    
    // Save the secret temporarily (it's not enabled until verified)
    user.twoFactorSecret = secret;
    await user.save();

    // Generate otpauth URL for Google Authenticator / Authy
    const otpauthUrl = generateURI({
      issuer: 'LoadFlow Platform',
      label: user.email,
      secret
    });
    
    // Convert URL to QR Code data URI
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    await logAction({
      req,
      userId: user.id,
      action: '2FA_SETUP_STARTED',
      entityType: 'User',
      entityId: user.id
    });

    return NextResponse.json({
      secret,
      qrCode: qrCodeDataUrl
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Generate 2FA error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
