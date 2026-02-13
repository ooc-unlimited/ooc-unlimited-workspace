import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET all agents
export async function GET() {
  const agents = db.prepare(`
    SELECT a.*, 
      (SELECT MAX(sh.entered_at) FROM stage_history sh WHERE sh.agent_id = a.id) as last_stage_change,
      CASE 
        WHEN julianday('now') - julianday(
          COALESCE(
            (SELECT MAX(sh.entered_at) FROM stage_history sh WHERE sh.agent_id = a.id),
            a.created_at
          )
        ) > 1 AND a.current_stage < 11 THEN 1 
        ELSE 0 
      END as is_stalled
    FROM agents a 
    ORDER BY a.updated_at DESC
  `).all();
  return NextResponse.json(agents);
}

// POST new agent
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, licensed } = body;
  
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO agents (id, name, phone, email, licensed, current_stage, ica_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)
  `).run(id, name, phone || null, email || null, licensed ?? 1, now, now, now);

  // Add initial stage history
  db.prepare(`INSERT INTO stage_history (agent_id, stage, entered_at) VALUES (?, 1, ?)`).run(id, now);

  // Log activity
  db.prepare(`INSERT INTO activity_log (agent_id, agent_name, action, details) VALUES (?, ?, ?, ?)`).run(
    id, name, 'Agent Added', `${name} - ICA submitted, pipeline started`
  );

  // Add engagement tracking items
  db.prepare(`INSERT INTO engagement (agent_id, type, due_date) VALUES (?, 'homework', ?)`).run(
    id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  );
  db.prepare(`INSERT INTO engagement (agent_id, type, due_date) VALUES (?, 'onboarding_school', ?)`).run(
    id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  );

  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
  return NextResponse.json(agent, { status: 201 });
}
