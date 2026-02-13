'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  stageCounts: Array<{ stage: number; name: string; short: string; color: string; count: number }>;
  total: number; stalled: number; thisWeek: number; thisMonth: number;
  stickRate: number; producing: number;
  avgTimes: Array<{ stage: number; name: string; avgHours: number | null }>;
  conversions: Array<{ from: string; to: string; rate: number; fromCount: number; toCount: number }>;
}

export default function MetricsPage() {
  const [m, setM] = useState<Metrics | null>(null);
  useEffect(() => { fetch('/api/metrics').then(r => r.json()).then(setM); }, []);
  if (!m) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Metrics</h1>
        <p className="text-zinc-500 text-sm mt-1">Pipeline performance and conversion analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: m.total, sub: '' },
          { label: 'Stick Rate', value: `${m.stickRate}%`, sub: `${m.producing} producing` },
          { label: 'This Week', value: m.thisWeek, sub: 'new recruits' },
          { label: 'This Month', value: m.thisMonth, sub: 'new recruits' },
        ].map(card => (
          <div key={card.label} className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{card.label}</p>
            <p className="text-3xl font-bold mt-1 text-white">{card.value}</p>
            {card.sub && <p className="text-xs text-zinc-600 mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Conversion Rates</h2>
        {m.conversions.length === 0 || m.total === 0 ? (
          <p className="text-zinc-500 text-sm">Add agents to see conversion data.</p>
        ) : (
          <div className="space-y-3">
            {m.conversions.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 text-xs text-zinc-400 text-right shrink-0">{c.from}</div>
                <div className="text-zinc-600">→</div>
                <div className="w-24 text-xs text-zinc-400 shrink-0">{c.to}</div>
                <div className="flex-1 bg-[#1a1a1a] rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 flex items-center px-2 text-xs text-white font-medium"
                    style={{ width: `${Math.max(c.rate, 3)}%` }}
                  >
                    {c.rate > 10 && `${c.rate}%`}
                  </div>
                </div>
                <div className="w-20 text-sm text-zinc-400 text-right">
                  {c.rate}% <span className="text-zinc-600 text-xs">({c.toCount}/{c.fromCount})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Average Time Per Stage */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Average Time Per Stage</h2>
        {m.total === 0 ? (
          <p className="text-zinc-500 text-sm">Add agents to see timing data.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {m.avgTimes.map(t => (
              <div key={t.stage} className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-3 text-center">
                <p className="text-xs text-zinc-500">{t.name}</p>
                <p className="text-lg font-bold mt-1">
                  {t.avgHours !== null ? (
                    t.avgHours < 24 ? `${t.avgHours}h` : `${Math.round(t.avgHours / 24 * 10) / 10}d`
                  ) : '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stage Distribution */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Stage Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {m.stageCounts.map(s => (
            <div key={s.stage} className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-3 text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: s.color }} />
              <p className="text-xs text-zinc-500">{s.short}</p>
              <p className="text-2xl font-bold mt-1">{s.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
