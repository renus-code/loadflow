import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
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

    // Create a notification for Admins
    await Notification.create({
      message: `Driver Request from ${user.name || user.email}: Add ${firstName} ${lastName} (${email})`,
      type: 'INFO',
      targetRole: 'Admin',
      link: '/dashboard/users/create'
    });

    return NextResponse.json({ message: "Driver request sent successfully" });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Error" }, { status: 500 });
  }
}
