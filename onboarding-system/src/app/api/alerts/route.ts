import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getStageName } from '@/lib/stages';

export async function GET() {
  // Stalled agents
  const stalled = db.prepare(`
    SELECT a.id, a.name, a.current_stage, a.phone,
      ROUND((julianday('now') - julianday(
        COALESCE(
          (SELECT MAX(sh.entered_at) FROM stage_history sh WHERE sh.agent_id = a.id),
          a.created_at
        )
      )) * 24, 1) as hours_stalled
    FROM agents a
    WHERE a.current_stage < 11
    AND julianday('now') - julianday(
      COALESCE(
        (SELECT MAX(sh.entered_at) FROM stage_history sh WHERE sh.agent_id = a.id),
        a.created_at
      )
    ) > 1
    ORDER BY hours_stalled DESC
  `).all() as Array<{ id: string; name: string; current_stage: number; phone: string; hours_stalled: number }>;

  const stalledAlerts = stalled.map(a => ({
    ...a,
    stage_name: getStageName(a.current_stage),
    type: 'stall',
    severity: a.hours_stalled > 72 ? 'critical' : a.hours_stalled > 48 ? 'warning' : 'info',
    message: `${a.name} has been stuck at "${getStageName(a.current_stage)}" for ${Math.round(a.hours_stalled)}h`,
  }));

  // 7-day filter: agents past 7 days who haven't engaged
  const unengaged = db.prepare(`
    SELECT a.id, a.name, a.current_stage, a.ica_date
    FROM agents a
    WHERE julianday('now') - julianday(a.ica_date) >= 7
    AND a.current_stage < 5
    AND NOT EXISTS (
      SELECT 1 FROM engagement e WHERE e.agent_id = a.id AND e.completed = 1
    )
  `).all() as Array<{ id: string; name: string; current_stage: number; ica_date: string }>;

  const engagementAlerts = unengaged.map(a => ({
    ...a,
    stage_name: getStageName(a.current_stage),
    type: '7day_filter',
    severity: 'warning' as const,
    message: `${a.name} — 7+ days since ICA, no engagement (homework/onboarding school)`,
  }));

  // PhoneZone reminder (check if Monday)
  const now = new Date();
  const isMonday = now.getDay() === 1;
  const phoneZoneAlert = isMonday ? [{
    type: 'phonezone',
    severity: 'info',
    message: 'PhoneZone tonight at 8 PM EST! Send reminders to all active agents.',
  }] : [];

  return NextResponse.json({
    alerts: [...stalledAlerts, ...engagementAlerts, ...phoneZoneAlert],
    counts: {
      stalled: stalledAlerts.length,
      unengaged: engagementAlerts.length,
      total: stalledAlerts.length + engagementAlerts.length + phoneZoneAlert.length,
    }
  });
}
