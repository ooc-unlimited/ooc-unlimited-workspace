import { NextRequest, NextResponse } from 'next/server';
import { getEvent, updateEvent } from '@/lib/grand-opening-factory';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const event = getEvent(Number(params.id));
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(JSON.parse(event.checklist_state || '{}'));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  updateEvent(Number(params.id), { checklist_state: JSON.stringify(data) } as never);
  return NextResponse.json({ ok: true });
}
