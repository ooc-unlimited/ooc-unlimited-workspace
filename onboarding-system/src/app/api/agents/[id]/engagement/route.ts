import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// PATCH toggle engagement item
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { type } = await req.json();
  
  if (!type) {
    return NextResponse.json({ error: 'Type is required' }, { status: 400 });
  }

  const existing = db.prepare(
    'SELECT * FROM engagement WHERE agent_id = ? AND type = ?'
  ).get(id, type) as { id: number; completed: number } | undefined;

  if (!existing) {
    return NextResponse.json({ error: 'Engagement record not found' }, { status: 404 });
  }

  const newCompleted = existing.completed ? 0 : 1;
  const now = new Date().toISOString();

  db.prepare(
    'UPDATE engagement SET completed = ?, completed_at = ? WHERE id = ?'
  ).run(newCompleted, newCompleted ? now : null, existing.id);

  // Log activity
  const agent = db.prepare('SELECT name FROM agents WHERE id = ?').get(id) as { name: string } | undefined;
  const label = type === 'homework' ? 'Building an Empire homework' : 'Onboarding School attendance';
  db.prepare(
    'INSERT INTO activity_log (agent_id, agent_name, action, details) VALUES (?, ?, ?, ?)'
  ).run(id, agent?.name ?? 'Unknown', newCompleted ? 'Engagement Completed' : 'Engagement Unchecked', label);

  const engagement = db.prepare('SELECT * FROM engagement WHERE agent_id = ?').all(id);
  return NextResponse.json(engagement);
}
