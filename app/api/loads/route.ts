import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load, { IStop } from "@/models/Load";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let filter = {};
    if (user.role === 'Driver') {
      filter = { assignedDriverId: user.id };
    }

    const loads = await Load.find(filter)
      .populate('assignedDriverId', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(loads);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!requireRole(user, ['Admin', 'Dispatcher'])) {
      return NextResponse.json({ error: "Forbidden: Only Dispatchers and Admins can create loads" }, { status: 403 });
    }

    await dbConnect();
    console.log("[Loads API] POST request received - Multi-stop support");
    const body = await req.json();
    const { 
      loadNumber,
      pickups,
      deliveries,
      quantity,
      quantityUnit,
      weight,
      weightUnit
    } = body;

    if (!loadNumber || !pickups || !Array.isArray(pickups) || pickups.length === 0 || 
        !deliveries || !Array.isArray(deliveries) || deliveries.length === 0 || 
        !quantity || !quantityUnit || !weight || !weightUnit) {
      return NextResponse.json({ error: "Missing or invalid required fields (loadNumber, pickups, deliveries, quantity, weight)" }, { status: 400 });
    }

    const newLoad = await Load.create({
      loadNumber,
      pickups: pickups.map((p: IStop) => ({
        ...p,
        date: new Date(p.date)
      })),
      deliveries: deliveries.map((d: IStop) => ({
        ...d,
        date: new Date(d.date)
      })),
      quantity: Number(quantity),
      quantityUnit,
      weight: Number(weight),
      weightUnit,
      createdBy: user!.id,
      status: 'PENDING'
    });

    return NextResponse.json(newLoad, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}

