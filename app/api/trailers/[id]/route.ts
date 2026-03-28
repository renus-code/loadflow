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
    const updatedTrailer = await Trailer.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTrailer) {
      return NextResponse.json({ error: 'Trailer not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTrailer, { status: 200 });
  } catch (error: any) {
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
