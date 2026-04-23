/**
 * ======================================================================================
 * API ROUTE: Motorized Asset Mutation (Truck By ID)
 * ======================================================================================
 * Modifies or retires power-unit records within the fleet registry.
 * 
 * Features:
 * 1. Dynamic Object Stripping: Prevents modification of protected fields (`_id`, `__v`, timestamps) during mass updates.
 * 2. Cross-Record Conflict Resolution: Verifies that new plates or numbers don't belong to another active truck.
 * 3. Concurrency Protection: Throws a 409 Conflict if another administrator modified the truck during the current session.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Truck from '@/models/Truck';
import { getUserFromRequest, requireRole } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!requireRole(userPayload, ['Admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const updateData = await req.json();

    await connectToDatabase();
    const truck = await Truck.findById(id);

    if (!truck) {
      return NextResponse.json({ error: 'Truck not found' }, { status: 404 });
    }

    // Uniqueness check for updates
    const checkFields = [];
    if (updateData.truckNo) checkFields.push({ truckNo: updateData.truckNo });
    if (updateData.vin) checkFields.push({ vin: updateData.vin });
    if (updateData.plate) checkFields.push({ plate: updateData.plate });

    if (checkFields.length > 0) {
      const duplicate = await Truck.findOne({
        $or: checkFields,
        _id: { $ne: id }
      });
      if (duplicate) {
        if (duplicate.truckNo === updateData.truckNo) return NextResponse.json({ error: "Truck number already exists" }, { status: 409 });
        if (duplicate.vin === updateData.vin) return NextResponse.json({ error: "VIN number already exists" }, { status: 409 });
        if (duplicate.plate === updateData.plate) return NextResponse.json({ error: "License plate already exists" }, { status: 409 });
      }
    }

    // Update fields from body
    Object.keys(updateData).forEach((key) => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        truck[key] = updateData[key];
      }
    });

    // Explicitly check for version mismatch if __v is provided
    if (updateData.__v !== undefined && truck.__v !== updateData.__v) {
      return NextResponse.json({ error: 'Data has been modified by another user. Please refresh.' }, { status: 409 });
    }

    await truck.save();

    // AUDIT LOG TRUCK UPDATE
    await logAction({ 
      req, 
      userId: userPayload!.id, 
      action: 'TRUCK_UPDATED', 
      entityType: 'Truck', 
      entityId: id,
      details: { updatedFields: Object.keys(updateData) }
    });

    return NextResponse.json(truck, { status: 200 });
  } catch (error: any) {
    if (error.name === 'VersionError') {
      return NextResponse.json({ error: 'Data has been modified by another user. Please refresh.' }, { status: 409 });
    }
    console.error('Update truck error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!requireRole(userPayload, ['Admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    await connectToDatabase();
    const deletedTruck = await Truck.findByIdAndDelete(id);

    if (!deletedTruck) {
      return NextResponse.json({ error: 'Truck not found' }, { status: 404 });
    }

    // AUDIT LOG TRUCK DELETION
    await logAction({ 
      req, 
      userId: userPayload!.id, 
      action: 'TRUCK_DELETED', 
      entityType: 'Truck', 
      entityId: id,
      details: { truckNo: deletedTruck.truckNo }
    });

    return NextResponse.json({ message: 'Truck deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete truck error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
