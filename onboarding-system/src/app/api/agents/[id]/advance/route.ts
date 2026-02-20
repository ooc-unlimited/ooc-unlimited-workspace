import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getStageName } from '@/lib/stages';

// POST advance agent to next stage
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!agent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const currentStage = agent.current_stage as number;
  const targetStage = body.stage ?? currentStage + 1;
  if (targetStage > 11 || targetStage < 1) {
    return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
  }

  const now = new Date().toISOString();

  // Close current stage history
  db.prepare(`UPDATE stage_history SET exited_at = ? WHERE agent_id = ? AND stage = ? AND exited_at IS NULL`).run(now, id, currentStage);

  // Open new stage
  db.prepare(`INSERT INTO stage_history (agent_id, stage, entered_at) VALUES (?, ?, ?)`).run(id, targetStage, now);

  // Update agent
  db.prepare(`UPDATE agents SET current_stage = ?, updated_at = ? WHERE id = ?`).run(targetStage, now, id);

  // Log activity
  const action = targetStage > currentStage ? 'Stage Advanced' : 'Stage Reverted';
  db.prepare(`INSERT INTO activity_log (agent_id, agent_name, action, details) VALUES (?, ?, ?, ?)`).run(
    id, agent.name, action,
    `${getStageName(currentStage)} → ${getStageName(targetStage)}`
  );

  const updated = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
  return NextResponse.json(updated);
}
