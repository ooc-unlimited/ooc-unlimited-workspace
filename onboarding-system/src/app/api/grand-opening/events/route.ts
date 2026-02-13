import { NextRequest, NextResponse } from 'next/server';
import { listEvents, createEvent, generatePosts } from '@/lib/grand-opening-factory';

export async function GET() {
  return NextResponse.json(listEvents());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.agent_name || !data.event_date) {
    return NextResponse.json({ error: 'agent_name and event_date required' }, { status: 400 });
  }
  const event = createEvent(data);
  generatePosts(event);
  return NextResponse.json(event, { status: 201 });
}
