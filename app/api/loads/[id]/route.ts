import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load from "@/models/Load";
import ProofOfDelivery from "@/models/ProofOfDelivery";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { logAction } from "@/lib/audit";

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

    // If pickups or deliveries are updated, recalculate coordinates and totals
    if (body.pickups || body.deliveries) {
      const { getMockCoordinates, calculateMockRouteStats } = await import('@/lib/maps');
      const currentPickups = body.pickups || load.pickups;
      const currentDeliveries = body.deliveries || load.deliveries;
      
      body.pickups = await Promise.all(currentPickups.map(async (p: any) => {
        if (!p.lat || !p.lng || p.address) { 
          // Re-geocode if address changed or coordinates are missing
          const coords = await getMockCoordinates(p.address || load.pickups[0].address, p.city, p.state);
          p.lat = coords.lat; p.lng = coords.lng;
        }
        return p;
      }));
      
      body.deliveries = await Promise.all(currentDeliveries.map(async (d: any) => {
        if (!d.lat || !d.lng || d.address) {
          const coords = await getMockCoordinates(d.address || load.deliveries[0].address, d.city, d.state);
          d.lat = coords.lat; d.lng = coords.lng;
        }
        return d;
      }));

      const stats = await calculateMockRouteStats(body.pickups, body.deliveries);
      body.totalDistance = stats.distance;
      body.estimatedDuration = stats.duration;
    }

    // Update fields from body
    Object.keys(body).forEach((key) => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        load.set(key, body[key]);
      }
    });

    // Explicitly check for version mismatch if __v is provided
    if (body.__v !== undefined && load.__v !== body.__v) {
      return NextResponse.json({ error: "Data has been modified by another user. Please refresh." }, { status: 409 });
    }

    try {
      await load.save();
      await logAction({
        req,
        userId: user.id,
        action: 'LOAD_UPDATED',
        entityType: 'Load',
        entityId: id,
        details: { status: load.status, updatedKeys: Object.keys(body) },
      });
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
      await logAction({ req, userId: user.id, action: 'LOAD_CANCELLED', entityType: 'Load', entityId: id });
      return NextResponse.json({ message: "Load cancelled successfully" });
    }

    // Admin: permanent delete
    await Load.findByIdAndDelete(id);
    await logAction({ req, userId: user.id, action: 'LOAD_DELETED', entityType: 'Load', entityId: id });
    return NextResponse.json({ message: "Load deleted permanently" });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
