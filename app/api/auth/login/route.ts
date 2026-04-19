/**
 * ======================================================================================
 * API ROUTE: Secure Authentication (Login)
 * ======================================================================================
 * The core security gateway for user session management.
 * 
 * Features:
 * 1. Brute-Force Protection: Implements a 3-attempt lockout threshold for non-admin users.
 * 2. Rate Limiting: Integrated with the IP-based rate limiter to prevent automated attacks.
 * 3. 2FA Orchestration: Dynamically detects and enforces TOTP requirements if enabled.
 * 4. Secure Session: Issues signed JWT tokens with tokenVersion tracking for revocation.
 * 5. Data Privacy: Sanitizes user objects before response and uses httpOnly cookies.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { checkRateLimit } from "@/lib/ratelimit";

const MAX_ATTEMPTS = 3; // Lock after 3 failed attempts

export async function POST(req: NextRequest) {
  try {
    // ── RATE LIMIT ───────────────────────────────────────────────────────────
    const limitResponse = checkRateLimit(req, { max: 10, windowMs: 15 * 60 * 1000 });
    if (limitResponse) return limitResponse;

    const body = await req.json();
    const { email: rawEmail, password } = body;

    // ── INPUT TYPE GUARD ─────────────────────────────────────────────────────
    if (typeof rawEmail !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // ── LOCKOUT CHECK ────────────────────────────────────────────────────────
    if (user.isLocked && user.role !== "Admin") {
      return NextResponse.json(
        {
          error: "Account is locked",
          locked: true,
          message:
            "Your account has been locked due to too many failed login attempts. Please contact an administrator to unlock your account, or submit a password reset request.",
        },
        { status: 403 },
      );
    }

    // ── PASSWORD CHECK ───────────────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const newAttempts = (user.loginAttempts || 0) + 1;

      if (newAttempts >= MAX_ATTEMPTS && user.role !== "Admin") {
        // Lock the account
        await User.findByIdAndUpdate(user._id, {
          loginAttempts: newAttempts,
          isLocked: true,
        });
        return NextResponse.json(
          {
            error: "Account locked",
            locked: true,
            message: `Account locked after ${MAX_ATTEMPTS} failed attempts. Contact your administrator to unlock it.`,
          },
          { status: 403 },
        );
      }

      // Increment attempt counter
      await User.findByIdAndUpdate(user._id, { loginAttempts: newAttempts });

      if (user.role === "Admin") {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      const remaining = MAX_ATTEMPTS - newAttempts;
      return NextResponse.json(
        {
          error: `Invalid credentials. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before account lockout.`,
        },
        { status: 401 },
      );
    }

    // ── 2FA CHECK ────────────────────────────────────────────────────────────
    if (user.isTwoFactorEnabled) {
      const { code } = body;
      
      if (!code) {
        return NextResponse.json(
          { message: 'Two-factor authentication required', requires2FA: true },
          { status: 200 }
        );
      }

      const { verify } = await import('otplib');
      const result = await verify({ token: code, secret: user.twoFactorSecret! });

      if (!result.valid) {
        return NextResponse.json({ error: 'Invalid two-factor authentication code' }, { status: 400 });
      }
    }

    // ── SUCCESS — reset attempt counter ──────────────────────────────────────
    await User.findByIdAndUpdate(user._id, {
      loginAttempts: 0,
      isLocked: false,
    });

    // Generate JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ||
        "fallback_secret_for_development_do_not_use_in_prod",
    );
    const token = await new SignJWT({ 
      id: user._id.toString(), 
      role: user.role, 
      tokenVersion: user.tokenVersion || 0 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { id: user._id, name: user.name, role: user.role },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
