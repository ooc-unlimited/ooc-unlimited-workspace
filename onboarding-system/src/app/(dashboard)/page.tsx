'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
interface Metrics {
  stageCounts: Array<{ stage: number; name: string; short: string; color: string; count: number }>;
  total: number;
  stalled: number;
  thisWeek: number;
  thisMonth: number;
  stickRate: number;
  producing: number;
  recentActivity: Array<{ id: number; agent_name: string; action: string; details: string; created_at: string }>;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [alerts, setAlerts] = useState<{ counts: { total: number; stalled: number } } | null>(null);

  useEffect(() => {
    fetch('/api/metrics').then(r => r.json()).then(setMetrics);
    fetch('/api/alerts').then(r => r.json()).then(setAlerts);
  }, []);

  if (!metrics) return <div className="flex items-center justify-center h-64 text-zinc-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">72-Hour Agent Onboarding Automation</p>
        </div>
        <Link
          href="/agents?add=true"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Agent
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Agents', value: metrics.total, color: 'text-white' },
          { label: 'This Week', value: metrics.thisWeek, color: 'text-indigo-400' },
          { label: 'This Month', value: metrics.thisMonth, color: 'text-purple-400' },
          { label: 'Producing', value: metrics.producing, color: 'text-emerald-400' },
          { label: 'Stalled', value: metrics.stalled, color: metrics.stalled > 0 ? 'text-red-400' : 'text-zinc-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111111] border border-[#262626] rounded-xl p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      {alerts && alerts.counts.total > 0 && (
        <Link href="/alerts" className="block bg-red-500/10 border border-red-500/20 rounded-xl p-4 hover:bg-red-500/15 transition-colors">
          <p className="text-red-400 font-medium">
            🚨 {alerts.counts.total} alert{alerts.counts.total !== 1 ? 's' : ''} require attention
            {alerts.counts.stalled > 0 && ` • ${alerts.counts.stalled} stalled agent${alerts.counts.stalled !== 1 ? 's' : ''}`}
          </p>
        </Link>
      )}

      {/* Pipeline Funnel */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Pipeline</h2>
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
          <div className="space-y-3">
            {metrics.stageCounts.map((s) => {
              const maxCount = Math.max(...metrics.stageCounts.map(x => x.count), 1);
              const width = Math.max((s.count / maxCount) * 100, 4);
              return (
                <div key={s.stage} className="flex items-center gap-4">
                  <div className="w-32 text-xs text-zinc-400 text-right shrink-0">{s.short}</div>
                  <div className="flex-1 bg-[#1a1a1a] rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center px-3 text-xs font-medium text-white transition-all duration-500"
                      style={{ width: `${width}%`, backgroundColor: s.color }}
                    >
                      {s.count > 0 && s.count}
                    </div>
                  </div>
                  <div className="w-8 text-sm text-zinc-500 text-right">{s.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="bg-[#111111] border border-[#262626] rounded-xl divide-y divide-[#262626]">
          {metrics.recentActivity.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No activity yet. Add your first agent to get started.
            </div>
          ) : (
            metrics.recentActivity.map(a => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-white">{a.agent_name}</span>
                  <span className="text-zinc-500 text-sm ml-2">— {a.action}</span>
                  {a.details && <p className="text-xs text-zinc-600 mt-0.5">{a.details}</p>}
                </div>
                <span className="text-xs text-zinc-600 shrink-0">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
