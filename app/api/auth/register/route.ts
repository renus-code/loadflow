import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest, requireRole } from '@/lib/auth';
import { checkRateLimit } from '@/lib/ratelimit';
import { logAction } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email: rawEmail, password, role } = body;

    // ── INPUT TYPE GUARD ─────────────────────────────────────────────────────
    if (typeof rawEmail !== 'string') {
      return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();
    const existingUser = await User.findOne({ email });

    // Check if the request is from an Admin (to create an invitation)
    const adminPayload = await getUserFromRequest(req);
    const isAdmin = requireRole(adminPayload, ['Admin']);

    if (isAdmin) {
      // ADMIN MODE: Create or Update Invitation
      if (existingUser && !existingUser.isPending) {
        return NextResponse.json({ error: 'User already exists and is fully registered' }, { status: 400 });
      }

      const salt = password ? await bcrypt.genSalt(10) : null;
      const passwordHash = password ? await bcrypt.hash(password, salt!) : undefined;

      if (existingUser) {
        // Update existing pending user
        existingUser.name = name || existingUser.name;
        existingUser.role = role || existingUser.role;
        if (passwordHash) existingUser.passwordHash = passwordHash;
        await existingUser.save();
        await logAction({ req, userId: adminPayload!.id, action: 'USER_INVITE_UPDATED', entityType: 'User', entityId: existingUser._id.toString(), details: { email, role } });
        return NextResponse.json({ message: 'Invitation updated successfully' }, { status: 200 });
      } else {
        // Create new invitation
        const newUser = new User({
          name: name || 'Invited User',
          email,
          passwordHash: passwordHash || null,
          role: role || 'Driver',
          isPending: !password, // If no password provided, it's a pending invitation
        });
        await newUser.save();
        await logAction({ req, userId: adminPayload!.id, action: 'USER_INVITED', entityType: 'User', entityId: newUser._id.toString(), details: { email, role } });
        return NextResponse.json({ message: 'Invitation sent successfully', userId: newUser._id }, { status: 201 });
      }
    } else {
      // PUBLIC MODE: Self-Registration
      // ── RATE LIMIT (public path only — admin invites are RBAC-protected) ────────
      const limitResponse = checkRateLimit(req, { max: 10, windowMs: 60 * 60 * 1000 });
      if (limitResponse) return limitResponse;

      const { 
        phone, 
        licenseNumber, 
        address, 
        dob, 
        city, 
        province, 
        postalCode 
      } = body;

      if (!password) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
      }

      if (!existingUser) {
        return NextResponse.json({ error: 'This email has not been invited to join the platform. Please contact an administrator.' }, { status: 403 });
      }

      if (existingUser.role === 'Admin') {
        return NextResponse.json({ error: 'Admin accounts cannot be registered here. Please contact the system administrator.' }, { status: 403 });
      }

      if (!existingUser.isPending && existingUser.passwordHash) {
        return NextResponse.json({ error: 'This account is already registered. Please sign in.' }, { status: 400 });
      }

      // License Validation Logic
      if (licenseNumber) {
        const ontarioRegex = /^[A-Z][0-9]{4}-[0-9]{5}-[0-9]{5}$/;
        const quebecRegex = /^[A-Z][0-9]{12}$/;

        if (ontarioRegex.test(licenseNumber)) {
          // Cross-reference with DOB (Ontario Specific)
          if (dob) {
            const birthYear = new Date(dob).getFullYear().toString().slice(-2);
            const digitsOnly = licenseNumber.replace(/[^0-9]/g, '');
            const encodedYear = digitsOnly.substring(8, 10); // 9th and 10th digits
            if (birthYear !== encodedYear) {
              return NextResponse.json({ error: 'Ontario License Number does not match your Date of Birth year.' }, { status: 400 });
            }
          }
        } else if (!quebecRegex.test(licenseNumber)) {
          return NextResponse.json({ error: 'Invalid Driver\'s License format. Please use Ontario (A1234-56789-01234) or Quebec (A123456789012) format.' }, { status: 400 });
        }
      }

      // Activate the pending user
      const salt = await bcrypt.genSalt(10);
      existingUser.passwordHash = await bcrypt.hash(password, salt);
      existingUser.name = name || existingUser.name;
      
      // Update Driver-specific info if provided
      if (phone) existingUser.phone = phone;
      if (licenseNumber) existingUser.licenseNumber = licenseNumber;
      if (dob) existingUser.dob = new Date(dob);
      if (city) existingUser.city = city;
      if (province) existingUser.province = province;
      if (postalCode) existingUser.postalCode = postalCode;
      if (address) existingUser.address = address;

      existingUser.isPending = false;
      await existingUser.save();

      await logAction({ req, userId: existingUser._id.toString(), action: 'USER_ACTIVATED', entityType: 'User', entityId: existingUser._id.toString(), details: { email } });

      return NextResponse.json({ message: 'Account activated successfully' }, { status: 200 });
    }
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
