import { NextRequest, NextResponse } from 'next/server';
import { createGuest, listGuests, updateGuest } from '@/lib/grand-opening-factory';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const eventId = Number(params.id);
  const data = await req.json();
  if (!data.name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  // Check if already registered by email/phone
  const existing = listGuests(eventId).find(g =>
    (data.email && g.email === data.email) || (data.phone && g.phone === data.phone)
  );
  if (existing) {
    const updated = updateGuest(existing.id, { rsvp_status: 'registered' });
    return NextResponse.json(updated);
  }

  const guest = createGuest({
    event_id: eventId,
    name: data.name,
    phone: data.phone || null,
    email: data.email || null,
    rsvp_status: 'registered',
    category: 'warm',
  });
  return NextResponse.json(guest, { status: 201 });
}
