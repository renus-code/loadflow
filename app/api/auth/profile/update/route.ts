import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-12345');

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;

    const { name, phone, address, city, province, postalCode, licenseNumber, currentPassword, newPassword } = await req.json();

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Handle Profile Data Updates
    if (name) user.name = name;
    
    // Role-based field restrictions
    if (user.role === 'Driver' || user.role === 'Dispatcher') {
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;
      if (city !== undefined) user.city = city;
      if (province !== undefined) user.province = province;
      if (postalCode !== undefined) user.postalCode = postalCode;
    }
    
    if (user.role === 'Driver') {
      if (licenseNumber !== undefined) user.licenseNumber = licenseNumber;
    }

    // 3. Handle Password Update
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
        city: user.city,
        province: user.province
      }
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
