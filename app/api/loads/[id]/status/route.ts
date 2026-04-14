import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load from "@/models/Load";
import { getUserFromRequest } from "@/lib/auth";
import ProofOfDelivery from "@/models/ProofOfDelivery";
import Notification from "@/models/Notification";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { status, stopType, stopIndex, stopStatus, assignedDriverId, truckNumber, trailerNumber, truckType, trailerType } = body;

    const loadCheck = await Load.findById(id);
    if (!loadCheck) return NextResponse.json({ error: "Load not found" }, { status: 404 });

    // Fetch POD to check for its existence
    const pod = await ProofOfDelivery.findOne({ loadId: id });

    // Handle stop-level status update
    if (stopType && typeof stopIndex === 'number' && stopStatus) {
      if (user.role === 'Driver' && loadCheck.assignedDriverId?.toString() !== user.id) {
        return NextResponse.json({ error: "Forbidden: Not your load" }, { status: 403 });
      }

      const stops = stopType === 'pickups' ? loadCheck.pickups : loadCheck.deliveries;
      if (!stops[stopIndex]) return NextResponse.json({ error: "Stop not found" }, { status: 400 });
      
      stops[stopIndex].status = stopStatus;
      
      // Auto-update overall load status based on new requirements:
      // 1. IN_TRANSIT: Only when ALL pickups are PICKED_UP
      // 2. DELIVERED: Only when ALL deliveries are DELIVERED AND POD exists
      
      const allPickupsDone = loadCheck.pickups.every((p: { status: string }) => p.status === 'PICKED_UP');
      const allDeliveriesDone = loadCheck.deliveries.every((d: { status: string }) => d.status === 'DELIVERED');

      const oldStatus = loadCheck.status;
      if (allPickupsDone && !allDeliveriesDone) {
        loadCheck.status = 'IN_TRANSIT';
      } else if (allPickupsDone && allDeliveriesDone) {
        if (pod) {
          loadCheck.status = 'DELIVERED';
        } else {
          loadCheck.status = 'IN_TRANSIT'; 
        }
      }

      await loadCheck.save();

      // Notify dispatcher if a pickup occurred
      if (stopType === 'pickups' && stopStatus === 'PICKED_UP') {
        try {
          const driverName = user.role === 'Driver' ? user.name : 'A driver';
          await Notification.create({
            message: `Load #${loadCheck.loadNumber}: Pickup #${stopIndex + 1} at ${stops[stopIndex].city} has been completed by ${driverName}.`,
            type: 'INFO',
            userId: loadCheck.createdBy,
            targetRole: 'Dispatcher',
            link: `/dashboard?loadId=${id}`
          });
        } catch (notifError) {
          console.error("Failed to notify dispatcher of pickup:", notifError);
        }
      }

      // Notify dispatcher if a delivery occurred
      if (stopType === 'deliveries' && stopStatus === 'DELIVERED') {
        try {
          const driverName = user.role === 'Driver' ? user.name : 'A driver';
          await Notification.create({
            message: `Load #${loadCheck.loadNumber}: Delivery #${stopIndex + 1} at ${stops[stopIndex].city} has been completed by ${driverName}.`,
            type: 'INFO',
            userId: loadCheck.createdBy,
            targetRole: 'Dispatcher',
            link: `/dashboard?loadId=${id}`
          });
        } catch (notifError) {
          console.error("Failed to notify dispatcher of delivery stop:", notifError);
        }
      }

      // Notify dispatcher if status changed to IN_TRANSIT
      if (oldStatus !== 'IN_TRANSIT' && loadCheck.status === 'IN_TRANSIT') {
        try {
          const driverName = user.role === 'Driver' ? user.name : 'A driver';
          await Notification.create({
            message: `Load #${loadCheck.loadNumber} is now IN TRANSIT (Operator: ${driverName}).`,
            type: 'INFO',
            userId: loadCheck.createdBy,
            targetRole: 'Dispatcher',
            link: `/dashboard?loadId=${id}`
          });
        } catch (notifError) {
          console.error("Failed to notify dispatcher of in-transit status:", notifError);
        }
      }

      // Notify dispatcher if status changed to DELIVERED
      if (oldStatus !== 'DELIVERED' && loadCheck.status === 'DELIVERED') {
        try {
          const driverName = user.role === 'Driver' ? user.name : 'A driver';
          await Notification.create({
            message: `Load #${loadCheck.loadNumber} has been DELIVERED by ${driverName}.`,
            type: 'SUCCESS',
            userId: loadCheck.createdBy,
            targetRole: 'Dispatcher',
            link: `/dashboard?loadId=${id}`
          });
        } catch (notifError) {
          console.error("Failed to notify dispatcher of delivery:", notifError);
        }
      }

      return NextResponse.json({ ...loadCheck.toObject(), podUrl: pod?.imageUrl });
    }

    // Handle overall status update OR driver/truck/trailer assignment
    if (status) {
      const allStatuses = ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'PICKED_UP', 'DELIVERED', 'CANCELLED', 'COMPLETED'];
      if (!allStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      
      if (status === 'COMPLETED' && !pod) {
        return NextResponse.json({ error: "Proof of Delivery (POD) is required before completing the load" }, { status: 400 });
      }

      if (user.role === 'Driver') {
        return NextResponse.json({ error: "Drivers must update status per stop" }, { status: 403 });
      }
      loadCheck.status = status;
    }

    if (assignedDriverId !== undefined) {
      loadCheck.assignedDriverId = assignedDriverId || null;
      // If unassigning, revert status to PENDING if it was ASSIGNED
      if (!assignedDriverId && loadCheck.status === 'ASSIGNED') {
        loadCheck.status = 'PENDING';
      }
    }
    if (truckNumber !== undefined) loadCheck.truckNumber = truckNumber;
    if (trailerNumber !== undefined) loadCheck.trailerNumber = trailerNumber;
    if (truckType !== undefined) loadCheck.truckType = truckType || null;
    if (trailerType !== undefined) loadCheck.trailerType = trailerType || null;

    // Explicitly check for version mismatch if __v is provided
    if (body.__v !== undefined && loadCheck.__v !== body.__v) {
      return NextResponse.json({ error: "Data has been modified by another user. Please refresh." }, { status: 409 });
    }

    try {
      await loadCheck.save();
      const finalLoad = await Load.findById(id).populate('assignedDriverId', 'name email');
      return NextResponse.json({ ...finalLoad?.toObject(), podUrl: pod?.imageUrl });
    } catch (saveError: any) {
      if (saveError.name === 'VersionError') {
        return NextResponse.json({ error: "Data has been modified by another user. Please refresh." }, { status: 409 });
      }
      throw saveError;
    }
  } catch (error: unknown) {
    if ((error as any).name === 'VersionError') {
      return NextResponse.json({ error: "Data has been modified by another user. Please refresh." }, { status: 409 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
