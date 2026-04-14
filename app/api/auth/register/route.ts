import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { getUserFromRequest, requireRole } from '@/lib/auth';
import { checkRateLimit } from '@/lib/ratelimit';
import { logAction } from '@/lib/audit';
import { sendInvitationEmail } from '@/lib/email';

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

    const userPayload = await getUserFromRequest(req);
    const isAdmin = requireRole(userPayload, ['Admin']);
    const isDispatcher = requireRole(userPayload, ['Dispatcher']);

    if (isAdmin || (isDispatcher && (role === 'Driver' || !role))) {
      // ADMIN or DISPATCHER MODE: Create invitation/request
      if (existingUser && !existingUser.isPending) {
        return NextResponse.json({ error: 'User already exists and is fully registered' }, { status: 400 });
      }

      // Enforce Driver role if requester is Dispatcher
      const targetRole = isDispatcher ? 'Driver' : (role || 'Driver');

      const salt = password ? await bcrypt.genSalt(10) : null;
      const passwordHash = password ? await bcrypt.hash(password, salt!) : undefined;

      if (existingUser) {
        // Update existing pending user
        existingUser.name = name || existingUser.name;
        existingUser.role = targetRole;
        if (passwordHash) existingUser.passwordHash = passwordHash;
        await existingUser.save();
        await logAction({ req, userId: userPayload!.id, action: 'USER_INVITE_UPDATED', entityType: 'User', entityId: existingUser._id.toString(), details: { email, role } });

        // Notify original Dispatcher that Admin has invited the user
        if (isAdmin && existingUser.requestedBy) {
          try {
            await Notification.create({
              message: `Your candidate ${existingUser.name || email} has been officially invited by the Administrator.`,
              type: 'SUCCESS',
              userId: existingUser.requestedBy,
              link: '/dashboard/users'
            });
            
            // SEND INVITATION EMAIL TO DRIVER
            await sendInvitationEmail({
              to: email,
              name: existingUser.name || 'Candidate',
              role: targetRole
            });
          } catch (notifErr) { console.error('Failed to notify/email driver for invite:', notifErr); }
        } else if (isAdmin) {
          // Direct admin invite (no dispatcher request)
          try {
            await sendInvitationEmail({
              to: email,
              name: existingUser.name || 'Candidate',
              role: targetRole
            });
          } catch (err) { console.error('Failed to send direct admin invite email:', err); }
        }

        return NextResponse.json({ message: 'Invitation updated successfully' }, { status: 200 });
      } else {
        // Create new invitation or request
        const newUser = new User({
          name: name || 'Invited User',
          email,
          passwordHash: passwordHash || null,
          role: targetRole,
          isPending: true, // Dispatchers always create pending users
          requestedBy: isDispatcher ? userPayload!.id : undefined
        });
        await newUser.save();
        await logAction({ req, userId: userPayload!.id, action: 'USER_INVITED', entityType: 'User', entityId: newUser._id.toString(), details: { email, role } });

        // Create Admin Notification for Dispatcher requests
        if (isDispatcher) {
          try {
            await Notification.create({
              message: `Driver Request: ${name || email} has been submitted by Dispatcher for review.`,
              type: 'INFO',
              targetRole: 'Admin',
              link: '/dashboard/users'
            });
          } catch (notifErr) {
            console.error('Failed to create notification:', notifErr);
          }
        } else if (isAdmin) {
          // Admin creating a direct invite
          try {
            await sendInvitationEmail({
              to: email,
              name: name || 'Invited User',
              role: targetRole
            });
          } catch (err) {
            console.error('Failed to send direct admin invite email:', err);
          }
        }

        const message = isDispatcher ? 'Driver request submitted successfully' : 'Invitation sent successfully';
        return NextResponse.json({ message, userId: newUser._id }, { status: 201 });
      }
    } else if (isDispatcher) {
      return NextResponse.json({ error: 'Dispatchers can only request driver accounts.' }, { status: 403 });
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

      // Mandatory License Validation for Drivers
      if (existingUser.role === 'Driver' && !licenseNumber) {
        return NextResponse.json({ error: "License number is strictly required for Driver accounts." }, { status: 400 });
      }

      // License format & DOB Validation Logic
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

      // Notify Admins of new registration
      try {
        await Notification.create({
          message: `User Registration: ${existingUser.name} (${email}) has successfully activated their account.`,
          type: 'SUCCESS',
          targetRole: 'Admin',
          link: '/dashboard/users'
        });
      } catch (notifErr) { console.error('Failed to notify admin of activation:', notifErr); }

      // Notify original Dispatcher of candidate activation
      if (existingUser.requestedBy) {
        try {
          await Notification.create({
            message: `Success! Your driver candidate ${existingUser.name} has completed registration and is now ready for assignment.`,
            type: 'SUCCESS',
            userId: existingUser.requestedBy,
            link: '/dashboard'
          });
        } catch (notifErr) { console.error('Failed to notify dispatcher of activation:', notifErr); }
      }

      return NextResponse.json({ message: 'Account activated successfully' }, { status: 200 });
    }
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
