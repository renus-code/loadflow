import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import "@/models/User"; // Ensure User is registered for populate

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    // Only admins can view audit logs
    if (!requireRole(user, ['Admin'])) {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    await dbConnect();
    
    // Pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find({})
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await AuditLog.countDocuments({});

    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error fetching audit logs" }, { status: 500 });
  }
}
