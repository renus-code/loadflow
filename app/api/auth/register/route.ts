import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email: rawEmail, password, role } = await req.json();

    // Normalize email to lowercase for case-insensitive handling
    const email = rawEmail?.toLowerCase().trim();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists (case-insensitive — email is stored lowercase)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user
    // Role will default to 'Driver' if not provided
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role && ['Admin', 'Dispatcher', 'Driver'].includes(role) ? role : 'Driver',
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
