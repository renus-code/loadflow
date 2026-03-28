import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load from "@/models/Load";
import { getUserFromRequest } from "@/lib/auth";
import ProofOfDelivery from "@/models/ProofOfDelivery";

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

      if (allPickupsDone && !allDeliveriesDone) {
        loadCheck.status = 'IN_TRANSIT';
      } else if (allPickupsDone && allDeliveriesDone) {
        if (pod) {
          loadCheck.status = 'DELIVERED';
        } else {
          // If all delivered but no POD, stay IN_TRANSIT (or maybe a custom "AWAITING POD")
          // The user said "upload pod as well to chnage to delivered status"
          loadCheck.status = 'IN_TRANSIT'; 
        }
      }

      await loadCheck.save();
      return NextResponse.json({ ...loadCheck.toObject(), podUrl: pod?.imageUrl });
    }

    // Handle overall status update OR driver/truck/trailer assignment
    const updateFields: Record<string, string | null | number> = {};

    if (status) {
      const allStatuses = ['PENDING', 'IN_TRANSIT', 'PICKED_UP', 'DELIVERED', 'CANCELLED', 'COMPLETED'];
      if (!allStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      
      // POD requirement for COMPLETED status
      if (status === 'COMPLETED' && !pod) {
        return NextResponse.json({ error: "Proof of Delivery (POD) is required before completing the load" }, { status: 400 });
      }

      // Role constraints for overall load status
      if (user.role === 'Driver') {
        return NextResponse.json({ error: "Drivers must update status per stop" }, { status: 403 });
      }
      updateFields.status = status;
    }

    if (assignedDriverId !== undefined) updateFields.assignedDriverId = assignedDriverId || null;
    if (truckNumber !== undefined) updateFields.truckNumber = truckNumber;
    if (trailerNumber !== undefined) updateFields.trailerNumber = trailerNumber;
    if (truckType !== undefined) updateFields.truckType = truckType || null;
    if (trailerType !== undefined) updateFields.trailerType = trailerType || null;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No valid fields provided for update" }, { status: 400 });
    }

    const updatedLoad = await Load.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: "after", runValidators: true }
    ).populate('assignedDriverId', 'name email');

    return NextResponse.json({ ...updatedLoad?.toObject(), podUrl: pod?.imageUrl });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
