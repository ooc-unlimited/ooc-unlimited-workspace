import { NextRequest, NextResponse } from 'next/server';
import { listGuests, createGuest, updateGuest, deleteGuest, bulkCreateGuests } from '@/lib/grand-opening-factory';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(listGuests(Number(params.id)));
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const eventId = Number(params.id);
  const data = await req.json();

  // Bulk import
  if (Array.isArray(data.guests)) {
    const guests = bulkCreateGuests(eventId, data.guests);
    return NextResponse.json(guests, { status: 201 });
  }

  if (!data.name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  const guest = createGuest({ ...data, event_id: eventId });
  return NextResponse.json(guest, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const guest = updateGuest(data.id, data);
  return NextResponse.json(guest);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  deleteGuest(id);
  return NextResponse.json({ ok: true });
}
