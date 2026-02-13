import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET single agent with full details
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!agent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const history = db.prepare('SELECT * FROM stage_history WHERE agent_id = ? ORDER BY entered_at ASC').all(id);
  const notes = db.prepare('SELECT * FROM agent_notes WHERE agent_id = ? ORDER BY created_at DESC').all(id);
  const engagement = db.prepare('SELECT * FROM engagement WHERE agent_id = ?').all(id);
  const activity = db.prepare('SELECT * FROM activity_log WHERE agent_id = ? ORDER BY created_at DESC LIMIT 50').all(id);

  return NextResponse.json({ ...agent, history, notes, engagement, activity });
}

// PATCH update agent
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { name, phone, email, licensed } = body;

  const sets: string[] = [];
  const vals: unknown[] = [];
  if (name !== undefined) { sets.push('name = ?'); vals.push(name); }
  if (phone !== undefined) { sets.push('phone = ?'); vals.push(phone); }
  if (email !== undefined) { sets.push('email = ?'); vals.push(email); }
  if (licensed !== undefined) { sets.push('licensed = ?'); vals.push(licensed); }
  sets.push("updated_at = datetime('now')");

  if (sets.length > 1) {
    db.prepare(`UPDATE agents SET ${sets.join(', ')} WHERE id = ?`).run(...vals, id);
  }

  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
  return NextResponse.json(agent);
}

// DELETE agent
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  db.prepare('DELETE FROM agent_notes WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM stage_history WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM engagement WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM activity_log WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM agents WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
