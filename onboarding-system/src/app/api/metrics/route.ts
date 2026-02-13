import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { STAGES } from '@/lib/stages';

export async function GET() {
  // Agents per stage
  const stageCounts = STAGES.map(s => {
    const row = db.prepare('SELECT COUNT(*) as count FROM agents WHERE current_stage = ?').get(s.id) as { count: number };
    return { stage: s.id, name: s.name, short: s.short, color: s.color, count: row.count };
  });

  // Total agents
  const totalRow = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number };
  const total = totalRow.count;

  // Stalled agents (>24hr without stage change)
  const stalledRow = db.prepare(`
    SELECT COUNT(*) as count FROM agents a
    WHERE a.current_stage < 11
    AND julianday('now') - julianday(
      COALESCE(
        (SELECT MAX(sh.entered_at) FROM stage_history sh WHERE sh.agent_id = a.id),
        a.created_at
      )
    ) > 1
  `).get() as { count: number };

  // Average time per stage (in hours)
  const avgTimes = STAGES.map(s => {
    const row = db.prepare(`
      SELECT AVG((julianday(COALESCE(exited_at, datetime('now'))) - julianday(entered_at)) * 24) as avg_hours
      FROM stage_history WHERE stage = ?
    `).get(s.id) as { avg_hours: number | null };
    return { stage: s.id, name: s.short, avgHours: row.avg_hours ? Math.round(row.avg_hours * 10) / 10 : null };
  });

  // Conversion rates
  const conversions = STAGES.slice(0, -1).map((s, i) => {
    const fromCount = db.prepare('SELECT COUNT(DISTINCT agent_id) as c FROM stage_history WHERE stage = ?').get(s.id) as { c: number };
    const toCount = db.prepare('SELECT COUNT(DISTINCT agent_id) as c FROM stage_history WHERE stage = ?').get(STAGES[i + 1].id) as { c: number };
    const rate = fromCount.c > 0 ? Math.round((toCount.c / fromCount.c) * 100) : 0;
    return { from: s.short, to: STAGES[i + 1].short, rate, fromCount: fromCount.c, toCount: toCount.c };
  });

  // Weekly/monthly counts
  const thisWeek = db.prepare(`SELECT COUNT(*) as c FROM agents WHERE created_at >= datetime('now', '-7 days')`).get() as { c: number };
  const thisMonth = db.prepare(`SELECT COUNT(*) as c FROM agents WHERE created_at >= datetime('now', '-30 days')`).get() as { c: number };

  // Stick rate (made it to stage 11)
  const producingRow = db.prepare('SELECT COUNT(*) as c FROM agents WHERE current_stage = 11').get() as { c: number };
  const stickRate = total > 0 ? Math.round((producingRow.c / total) * 100) : 0;

  // Recent activity
  const recentActivity = db.prepare('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 20').all();

  return NextResponse.json({
    stageCounts,
    total,
    stalled: stalledRow.count,
    avgTimes,
    conversions,
    thisWeek: thisWeek.c,
    thisMonth: thisMonth.c,
    stickRate,
    producing: producingRow.c,
    recentActivity,
  });
}
