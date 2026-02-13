import { NextRequest, NextResponse } from 'next/server';
import { getEvent, updateEvent, deleteEvent } from '@/lib/grand-opening-factory';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const event = getEvent(Number(params.id));
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const event = updateEvent(Number(params.id), data);
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  deleteEvent(Number(params.id));
  return NextResponse.json({ ok: true });
}
