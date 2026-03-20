import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Load from '@/models/Load';

export async function GET() {
  try {
    await connectToDatabase();
    
    console.log('Cleaning existing loads...');
    await Load.deleteMany({});
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const loadsToInsert = [
      {
        loadNumber: "LD-1001",
        pickupAddress: "123 Toronto St",
        pickupCity: "Toronto",
        pickupState: "ON",
        pickupPostalCode: "M5V 2L7",
        pickupAppointmentNumber: "P-55221",
        pickupDate: today,
        pickupTime: "08:00",
        deliveryAddress: "456 Montreal Ave",
        deliveryCity: "Montreal",
        deliveryState: "QC",
        deliveryPostalCode: "H2Z 1A1",
        deliveryAppointmentNumber: "D-99334",
        deliveryDate: tomorrow,
        deliveryTime: "14:00",
        quantity: 12,
        quantityUnit: "pallets",
        weight: 15000,
        weightUnit: "lbs",
        status: "Pending"
      },
      {
        loadNumber: "LD-1002",
        pickupAddress: "789 Vancouver Way",
        pickupCity: "Vancouver",
        pickupState: "BC",
        pickupPostalCode: "V6B 1A1",
        pickupAppointmentNumber: "P-11223",
        pickupDate: today,
        pickupTime: "10:30",
        deliveryAddress: "321 Calgary Rd",
        deliveryCity: "Calgary",
        deliveryState: "AB",
        deliveryPostalCode: "T2P 1A1",
        deliveryAppointmentNumber: "D-44556",
        deliveryDate: tomorrow,
        deliveryTime: "09:00",
        quantity: 24,
        quantityUnit: "skids",
        weight: 38000,
        weightUnit: "lbs",
        status: "In Transit"
      }
    ];
    
    await Load.insertMany(loadsToInsert);
    
    return NextResponse.json({ success: true, message: 'Database re-seeded with new schema', count: loadsToInsert.length });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
