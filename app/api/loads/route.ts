// Loads API: Gets and creates cargo routes based on who is logged in.
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load, { IStop } from "@/models/Load";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filter: any = {};
    if (user.role === 'Driver') {
      filter.assignedDriverId = user.id;
      filter.status = { $ne: "CANCELLED" };
    } else if (user.role === 'Dispatcher') {
      filter.status = { $ne: "CANCELLED" };
    }
    // Admins see all loads including CANCELLED for permanent deletion approval

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

    const { getMockCoordinates, calculateMockRouteStats } = await import('@/lib/maps');

    const enrichedPickups = await Promise.all(pickups.map(async (p: IStop) => {
      const coords = await getMockCoordinates(p.address, p.city, p.state);
      return { ...p, date: new Date(p.date), lat: coords.lat, lng: coords.lng };
    }));
    
    const enrichedDeliveries = await Promise.all(deliveries.map(async (d: IStop) => {
      const coords = await getMockCoordinates(d.address, d.city, d.state);
      return { ...d, date: new Date(d.date), lat: coords.lat, lng: coords.lng };
    }));

    const routeStats = await calculateMockRouteStats(enrichedPickups, enrichedDeliveries);

    const newLoad = await Load.create({
      loadNumber,
      pickups: enrichedPickups,
      deliveries: enrichedDeliveries,
      totalDistance: routeStats.distance,
      estimatedDuration: routeStats.duration,
      quantity: Number(quantity),
      quantityUnit,
      weight: Number(weight),
      weightUnit,
      createdBy: user!.id,
      status: 'PENDING'
    });

    await logAction({
      req,
      userId: user!.id,
      action: 'LOAD_CREATED',
      entityType: 'Load',
      entityId: newLoad._id.toString(),
      details: { loadNumber },
    });

    return NextResponse.json(newLoad, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}

