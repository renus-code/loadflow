/**
 * ======================================================================================
 * API ROUTE: Non-Motorized Asset Mutation (Trailer By ID)
 * ======================================================================================
 * Modifies or retires trailer records within the fleet registry.
 * 
 * Features:
 * 1. Pre-Flight Uniqueness Check: Queries the DB against conflicting VINs or Plates before attempting saves.
 * 2. Optimistic Concurrency Control (OCC): Uses `__v` checks to prevent destructive mid-air collisions.
 * 3. Strict Admin Boundary: Denies mutation access to dispatchers and drivers to maintain registry integrity.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Trailer from '@/models/Trailer';
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
    const trailer = await Trailer.findById(id);

    if (!trailer) {
      return NextResponse.json({ error: 'Trailer not found' }, { status: 404 });
    }

    // Uniqueness check for updates
    const checkFields = [];
    if (updateData.trailerNo) checkFields.push({ trailerNo: updateData.trailerNo });
    if (updateData.vin) checkFields.push({ vin: updateData.vin });
    if (updateData.plate) checkFields.push({ plate: updateData.plate });

    if (checkFields.length > 0) {
      const duplicate = await Trailer.findOne({
        $or: checkFields,
        _id: { $ne: id }
      });
      if (duplicate) {
        if (duplicate.trailerNo === updateData.trailerNo) return NextResponse.json({ error: "Trailer number already exists" }, { status: 409 });
        if (duplicate.vin === updateData.vin) return NextResponse.json({ error: "VIN number already exists" }, { status: 409 });
        if (duplicate.plate === updateData.plate) return NextResponse.json({ error: "License plate already exists" }, { status: 409 });
      }
    }

    // Update fields from body
    Object.keys(updateData).forEach((key) => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        trailer[key] = updateData[key];
      }
    });

    // Explicitly check for version mismatch if __v is provided
    if (updateData.__v !== undefined && trailer.__v !== updateData.__v) {
      return NextResponse.json({ error: 'Data has been modified by another user. Please refresh.' }, { status: 409 });
    }

    await trailer.save();

    return NextResponse.json(trailer, { status: 200 });
  } catch (error: any) {
    if (error.name === 'VersionError') {
      return NextResponse.json({ error: 'Data has been modified by another user. Please refresh.' }, { status: 409 });
    }
    console.error('Update trailer error:', error);
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
    const deletedTrailer = await Trailer.findByIdAndDelete(id);

    if (!deletedTrailer) {
      return NextResponse.json({ error: 'Trailer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Trailer deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete trailer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
