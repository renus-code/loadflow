import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load from "@/models/Load";
import ProofOfDelivery from "@/models/ProofOfDelivery";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    // Use .lean() to return a plain object we can easily modify
    const load = await Load.findById(id).populate('assignedDriverId createdBy', 'name email').lean();
    if (!load) return NextResponse.json({ error: "Load not found" }, { status: 404 });

    if (user.role === 'Driver' && load.assignedDriverId?.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch POD if it exists
    const pod = await ProofOfDelivery.findOne({ loadId: id }).sort({ createdAt: -1 });
    
    return NextResponse.json({
      ...load,
      podUrl: pod?.imageUrl
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !requireRole(user, ['Admin', 'Dispatcher'])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    // Secure fields that should not be edited through this general PUT
    delete body.createdBy;
    delete body.assignedDriverId;
    delete body.status;

    const load = await Load.findById(id);
    if (!load) return NextResponse.json({ error: "Load not found" }, { status: 404 });

    // Update fields from body
    Object.keys(body).forEach((key) => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        load[key] = body[key];
      }
    });

    // Explicitly check for version mismatch if __v is provided
    if (body.__v !== undefined && load.__v !== body.__v) {
      return NextResponse.json({ error: "Data has been modified by another user. Please refresh." }, { status: 409 });
    }

    try {
      await load.save();
      return NextResponse.json(load);
    } catch (saveError: any) {
      if (saveError.name === 'VersionError') {
        return NextResponse.json({ error: "Data has been modified by another user. Please refresh." }, { status: 409 });
      }
      throw saveError;
    }
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !requireRole(user, ['Admin', 'Dispatcher'])) {
      return NextResponse.json({ error: "Forbidden: Only Dispatchers and Admins can delete loads" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    if (user.role === 'Dispatcher') {
      // Soft delete: update status to CANCELLED
      await Load.findByIdAndUpdate(id, { status: 'CANCELLED' });
      return NextResponse.json({ message: "Load cancelled successfully" });
    }

    // Admin: permanent delete
    await Load.findByIdAndDelete(id);
    return NextResponse.json({ message: "Load deleted permanently" });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
