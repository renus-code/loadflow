import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load from "@/models/Load";
import Notification from "@/models/Notification";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !requireRole(user, ['Admin', 'Dispatcher'])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { assignedDriverId, truckNumber, trailerNumber, truckType, trailerType } = body;

    if (!assignedDriverId || !truckNumber || !trailerNumber) {
      return NextResponse.json({ error: "Driver, Truck Number, and Trailer Number are required" }, { status: 400 });
    }

    const load = await Load.findById(id);
    if (!load) return NextResponse.json({ error: "Load not found" }, { status: 404 });
    
    if (user.role === 'Dispatcher' && load.createdBy?.toString() !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Explicitly check for version mismatch if __v is provided
    if (body.__v !== undefined && load.__v !== body.__v) {
      return NextResponse.json({ error: "Data has been modified by another user. Please refresh." }, { status: 409 });
    }

    // Assigning driver, truck, and trailer. 
    load.assignedDriverId = assignedDriverId;
    load.truckNumber = truckNumber;
    load.trailerNumber = trailerNumber;
    if (truckType) load.truckType = truckType;
    if (trailerType) load.trailerType = trailerType;

    try {
      await load.save();
      
      // Create notification for driver
      try {
        await Notification.create({
          message: `You have been assigned a new load: ${load.loadNumber || id}`,
          type: 'INFO',
          userId: assignedDriverId,
          link: `/dashboard?loadId=${id}`
        });
      } catch (notifError) {
        console.error("Failed to create notification for driver:", notifError);
      }

      const populatedLoad = await Load.findById(id).populate('assignedDriverId', 'name email');
      return NextResponse.json(populatedLoad);
    } catch (saveError: any) {
      if (saveError.name === 'VersionError') {
        return NextResponse.json({ error: "Data has been modified by another user. Please refresh." }, { status: 409 });
      }
      throw saveError;
    }
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Assign Error" }, { status: 500 });
  }
}
