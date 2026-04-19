/**
 * ======================================================================================
 * API ROUTE: Driver Recruitment Requests (/api/driver-requests)
 * ======================================================================================
 * Orchestrates the induction requests from dispatchers to the administrative team.
 * 
 * Features:
 * 1. Dispatcher Empowerment: Allows dispatchers to propose new drivers for the fleet.
 * 2. Admin Notification: Triggers an INFO-level alert for admins with actionable invite links.
 * 3. Pre-Validation: Checks for email duplication against the existing user database.
 * 4. Contextual Deep Linking: Embeds auto-fill parameters in admin links for seamless onboarding.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    // Only Dispatchers should be requesting drivers this way
    if (!user || !requireRole(user, ['Dispatcher'])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First Name, Last Name, and Email are required" }, { status: 400 });
    }

    // Check if the user already exists as a member
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "This email is already associated with an existing member." }, { status: 400 });
    }

    // Fetch the full requester user to get their name for the notification
    const requester = await User.findById(user.id);
    const requesterName = requester ? (requester.name || requester.email) : "A Dispatcher";

    // Create a notification for Admins with auto-fill parameters
    await Notification.create({
      message: `Driver Request from ${requesterName}: Add ${firstName} ${lastName} (${email})`,
      type: 'INFO',
      targetRole: 'Admin',
      link: `/dashboard/users?action=invite&email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
    });

    return NextResponse.json({ message: "Driver request sent successfully" });
  } catch (error: unknown) {
    console.error("Driver Request Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Error" }, { status: 500 });
  }
}
