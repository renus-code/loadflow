import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Truck from '@/models/Truck';
import { getUserFromRequest, requireRole } from '@/lib/auth';

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

    return NextResponse.json({ message: 'Truck deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete truck error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
