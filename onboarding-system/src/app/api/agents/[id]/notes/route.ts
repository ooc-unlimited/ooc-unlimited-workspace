import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 });

  db.prepare(`INSERT INTO agent_notes (agent_id, content) VALUES (?, ?)`).run(id, content);
  
  const agent = db.prepare('SELECT name FROM agents WHERE id = ?').get(id) as { name: string } | undefined;
  db.prepare(`INSERT INTO activity_log (agent_id, agent_name, action, details) VALUES (?, ?, ?, ?)`).run(
    id, agent?.name ?? 'Unknown', 'Note Added', content.substring(0, 100)
  );

  const notes = db.prepare('SELECT * FROM agent_notes WHERE agent_id = ? ORDER BY created_at DESC').all(id);
  return NextResponse.json(notes);
}
