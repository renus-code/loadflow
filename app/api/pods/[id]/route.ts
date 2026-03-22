import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ProofOfDelivery from "@/models/ProofOfDelivery";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    
    // id could refer to either the POD's _id or we might want to get PODs by loadId.
    // The requirement says GET /api/pods/:id. We'll return the specific POD.
    const pod = await ProofOfDelivery.findById(id).populate('loadId');
    if (!pod) return NextResponse.json({ error: "POD not found" }, { status: 404 });

    // Optional RBAC on view could go here.

    return NextResponse.json(pod);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!requireRole(user, ['Admin', 'Dispatcher'])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    const pod = await ProofOfDelivery.findByIdAndDelete(id);
    if (!pod) {
      return NextResponse.json({ error: "POD not found" }, { status: 404 });
    }

    // Cloudinary file removal could be added here, but keeping it simple as deleting the DB record.

    return NextResponse.json({ message: "POD deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
