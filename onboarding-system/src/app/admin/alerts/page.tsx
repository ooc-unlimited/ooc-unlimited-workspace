'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Alert {
  id?: string;
  name?: string;
  type: string;
  severity: string;
  message: string;
  hours_stalled?: number;
  stage_name?: string;
}

export default function AlertsPage() {
  const [data, setData] = useState<{ alerts: Alert[]; counts: { total: number } } | null>(null);

  useEffect(() => {
    fetch('/api/alerts').then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div className="text-zinc-500">Loading...</div>;

  const severityStyles: Record<string, string> = {
    critical: 'bg-red-500/10 border-red-500/20 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };

  const severityIcons: Record<string, string> = {
    critical: '🔴', warning: '🟡', info: '🔵',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {data.counts.total} active alert{data.counts.total !== 1 ? 's' : ''}
        </p>
      </div>

      {data.alerts.length === 0 ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-8 text-center">
          <p className="text-emerald-400 text-lg font-medium">✅ All clear!</p>
          <p className="text-zinc-500 text-sm mt-1">No alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.alerts.map((alert, i) => (
            <div key={i} className={`border rounded-xl p-4 ${severityStyles[alert.severity] || severityStyles.info}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {severityIcons[alert.severity]} {alert.message}
                  </p>
                  {alert.type === 'stall' && alert.hours_stalled && (
                    <p className="text-xs mt-1 opacity-70">Stalled for {Math.round(alert.hours_stalled)} hours at {alert.stage_name}</p>
                  )}
                </div>
                {alert.id && (
                  <Link href={`/agents/${alert.id}`} className="text-xs underline opacity-70 hover:opacity-100 shrink-0">
                    View Agent →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
