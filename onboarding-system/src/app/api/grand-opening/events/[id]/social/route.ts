import { NextRequest, NextResponse } from 'next/server';
import { getEvent, listPosts, generatePosts } from '@/lib/grand-opening-factory';
import db from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(listPosts(Number(params.id)));
}

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const event = getEvent(Number(params.id));
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const posts = generatePosts(event);
  return NextResponse.json(posts);
}

export async function PATCH(req: NextRequest) {
  const { id, posted } = await req.json();
  db.prepare('UPDATE grand_opening_posts SET posted = ? WHERE id = ?').run(posted ? 1 : 0, id);
  return NextResponse.json({ ok: true });
}
