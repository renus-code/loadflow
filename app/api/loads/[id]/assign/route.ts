import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load from "@/models/Load";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !requireRole(user, ['Admin', 'Dispatcher'])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    const { assignedDriverId, truckNumber, trailerNumber } = await req.json();

    if (!assignedDriverId || !truckNumber || !trailerNumber) {
      return NextResponse.json({ error: "Driver, Truck Number, and Trailer Number are required" }, { status: 400 });
    }

    const loadCheck = await Load.findById(id);
    if (!loadCheck) return NextResponse.json({ error: "Load not found" }, { status: 404 });
    
    if (user.role === 'Dispatcher' && loadCheck.createdBy?.toString() !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Assigning driver, truck, and trailer. 
    // Status remains PENDING until the driver starts pickups.
    const updatedLoad = await Load.findByIdAndUpdate(
      id,
      { assignedDriverId, truckNumber, trailerNumber },
      { new: true, runValidators: true }
    ).populate('assignedDriverId', 'name email');

    return NextResponse.json(updatedLoad);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Assign Error" }, { status: 500 });
  }
}
