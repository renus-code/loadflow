import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Load from "@/models/Load";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");

async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Currently showing all loads, but could filter by user.id if Load had a creator field
    const loads = await Load.find({}).sort({ createdAt: -1 });
    return NextResponse.json(loads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      loadNumber,
      pickupAddress,
      pickupCity,
      pickupState,
      pickupPostalCode,
      pickupAppointmentNumber,
      pickupDate,
      pickupTime,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryPostalCode,
      deliveryAppointmentNumber,
      deliveryDate,
      deliveryTime,
      quantity,
      quantityUnit,
      weight,
      weightUnit
    } = body;

    if (!loadNumber || !pickupAddress || !pickupCity || !pickupState || !pickupPostalCode || !deliveryAddress || !deliveryCity || !deliveryState || !deliveryPostalCode || !quantity || !quantityUnit || !weight || !weightUnit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newLoad = await Load.create({
      loadNumber,
      pickupAddress,
      pickupCity,
      pickupState,
      pickupPostalCode,
      pickupAppointmentNumber,
      pickupDate: new Date(pickupDate),
      pickupTime,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryPostalCode,
      deliveryAppointmentNumber,
      deliveryDate: new Date(deliveryDate),
      deliveryTime,
      quantity: Number(quantity),
      quantityUnit,
      weight: Number(weight),
      weightUnit,
      status: 'Pending'
    });

    return NextResponse.json(newLoad, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
