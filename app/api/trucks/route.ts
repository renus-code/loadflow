import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Truck from '@/models/Truck';
import { getUserFromRequest, requireRole } from '@/lib/auth';

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

    return NextResponse.json(newTruck, { status: 201 });
  } catch (error: any) {
    console.error('Create truck error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
