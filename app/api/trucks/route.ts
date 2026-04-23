/**
 * ======================================================================================
 * API ROUTE: Power Unit Asset Registry (/api/trucks)
 * ======================================================================================
 * Manages the digital twin inventory for fleet tractor units.
 * 
 * Features:
 * 1. Role-Based Access: GET allowed for all roles; POST restricted to 'Admin' only.
 * 2. Uniqueness Enforcement: Validates distinct TruckNo, VIN, and Plates before creation.
 * 3. Sorting Engine: Delivers truck assets in alpha-numeric order for fleet planning.
 * 4. Data Integrity: Performs strict field validation and numeric parsing (year).
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Truck from '@/models/Truck';
import { getUserFromRequest, requireRole } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!requireRole(userPayload, ['Admin', 'Dispatcher', 'Driver'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const trucks = await Truck.find({}).sort({ truckNo: 1 });
    return NextResponse.json(trucks, { status: 200 });
  } catch (error: any) {
    console.error('Fetch trucks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!requireRole(userPayload, ['Admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { truckNo, vin, plate, year, make, model, truckType } = await req.json();

    if (!truckNo || !vin || !plate || !year || !make || !model || !truckType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const existingTruck = await Truck.findOne({ $or: [{ truckNo }, { vin }, { plate }] });
    if (existingTruck) {
      if (existingTruck.truckNo === truckNo) return NextResponse.json({ error: "Truck number already exists" }, { status: 409 });
      if (existingTruck.vin === vin) return NextResponse.json({ error: "VIN number already exists" }, { status: 409 });
      if (existingTruck.plate === plate) return NextResponse.json({ error: "License plate already exists" }, { status: 409 });
    }

    const newTruck = await Truck.create({
      truckNo,
      vin,
      plate,
      year: Number(year),
      make,
      model,
      truckType,
    });

    // AUDIT LOG TRUCK CREATION
    await logAction({ 
      req, 
      userId: userPayload!.id, 
      action: 'TRUCK_CREATED', 
      entityType: 'Truck', 
      entityId: newTruck._id.toString(),
      details: { truckNo, plate }
    });

    return NextResponse.json(newTruck, { status: 201 });
  } catch (error: any) {
    console.error('Create truck error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
