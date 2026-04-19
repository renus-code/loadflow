/**
 * ======================================================================================
 * API ROUTE: Fleet Asset Inventory (/api/trailers)
 * ======================================================================================
 * Orchestrates the management of non-powered logistics equipment.
 * 
 * Features:
 * 1. Role-Based Access Control: GET permitted for operational visibility; POST restricted to Admins.
 * 2. Deduplication Protocol: Verifies VIN and Plate uniqueness to maintain registry integrity.
 * 3. Structured Metadata: Stores specialized trailer types (Reefer, Dry Van, etc.).
 * 4. Dynamic Sorting: Facilitates rapid asset selection for dispatchers via alpha-sorting.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Trailer from '@/models/Trailer';
import { getUserFromRequest, requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!requireRole(userPayload, ['Admin', 'Dispatcher', 'Driver'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const trailers = await Trailer.find({}).sort({ trailerNo: 1 });
    return NextResponse.json(trailers, { status: 200 });
  } catch (error: any) {
    console.error('Fetch trailers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = await getUserFromRequest(req);
    if (!requireRole(userPayload, ['Admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { trailerNo, vin, plate, year, make, model, trailerType } = await req.json();

    if (!trailerNo || !vin || !plate || !year || !make || !model || !trailerType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if duplicate trailer exists
    const existingTrailer = await Trailer.findOne({ $or: [{ trailerNo }, { vin }, { plate }] });
    if (existingTrailer) {
      if (existingTrailer.trailerNo === trailerNo) return NextResponse.json({ error: "Trailer number already exists" }, { status: 409 });
      if (existingTrailer.vin === vin) return NextResponse.json({ error: "VIN number already exists" }, { status: 409 });
      if (existingTrailer.plate === plate) return NextResponse.json({ error: "License plate already exists" }, { status: 409 });
    }

    const newTrailer = await Trailer.create({
      trailerNo,
      vin,
      plate,
      year: Number(year),
      make,
      model,
      trailerType,
    });

    return NextResponse.json(newTrailer, { status: 201 });
  } catch (error: any) {
    console.error('Create trailer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
