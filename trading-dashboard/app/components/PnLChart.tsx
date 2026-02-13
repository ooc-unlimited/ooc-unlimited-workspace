'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface DayData { date: string; pnl: number; }

export default function PnLChart({ data }: { data: DayData[] }) {
  if (!data.length) return <div className="text-text-secondary text-center py-8">No trades yet</div>;
  return (
    <div className="bg-bg-secondary border border-border-main rounded-lg p-4">
      <h3 className="text-sm text-text-secondary mb-4 uppercase tracking-wide">Daily P&L</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis dataKey="date" tick={{ fill: '#8b949e', fontSize: 11 }} />
          <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} tickFormatter={v => `$${v}`} />
          <Tooltip
            contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3' }}
            formatter={(v: number | undefined) => [`$${(v ?? 0).toFixed(0)}`, 'P&L']}
          />
          <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.pnl >= 0 ? '#3fb950' : '#f85149'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
