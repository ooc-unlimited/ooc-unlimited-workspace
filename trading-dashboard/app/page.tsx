'use client';

import { useEffect, useState } from 'react';
import { Trade, calcPnL } from '@/lib/types';
import { getTrades } from '@/lib/storage';
import StatCard from './components/StatCard';
import PnLChart from './components/PnLChart';

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => { setTrades(getTrades()); }, []);

  const totalPnL = trades.reduce((s, t) => s + calcPnL(t), 0);
  const winners = trades.filter(t => calcPnL(t) > 0);
  const winRate = trades.length ? ((winners.length / trades.length) * 100).toFixed(1) : '0';

  // daily P&L
  const byDay: Record<string, number> = {};
  trades.forEach(t => {
    const day = t.timestamp.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + calcPnL(t);
  });
  const dailyData = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pnl]) => ({ date: date.slice(5), pnl: Math.round(pnl) }));

  // running total
  let running = 0;
  const cumulativeData = dailyData.map(d => {
    running += d.pnl;
    return { date: d.date, pnl: running };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total P&L"
          value={`$${totalPnL.toLocaleString()}`}
          color={totalPnL >= 0 ? 'text-profit' : 'text-loss'}
        />
        <StatCard label="Win Rate" value={`${winRate}%`} color="text-accent" />
        <StatCard label="Total Trades" value={`${trades.length}`} />
        <StatCard
          label="Avg P&L / Trade"
          value={trades.length ? `$${Math.round(totalPnL / trades.length)}` : '$0'}
          color={totalPnL >= 0 ? 'text-profit' : 'text-loss'}
        />
      </div>
      <PnLChart data={dailyData} />
      <div className="bg-bg-secondary border border-border-main rounded-lg p-4">
        <h3 className="text-sm text-text-secondary mb-4 uppercase tracking-wide">Running Total</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {cumulativeData.map(d => (
            <div key={d.date} className="text-center">
              <div className="text-xs text-text-secondary">{d.date}</div>
              <div className={`font-mono font-bold ${d.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                ${d.pnl.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-bg-secondary border border-border-main rounded-lg p-4">
        <h3 className="text-sm text-text-secondary mb-4 uppercase tracking-wide">Recent Trades</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary text-xs uppercase border-b border-border-main">
                <th className="text-left py-2 pr-4">Date</th>
                <th className="text-left py-2 pr-4">Strategy</th>
                <th className="text-left py-2 pr-4">Dir</th>
                <th className="text-right py-2 pr-4">Entry</th>
                <th className="text-right py-2 pr-4">Exit</th>
                <th className="text-right py-2">P&L</th>
              </tr>
            </thead>
            <tbody>
              {[...trades].reverse().slice(0, 10).map(t => {
                const pnl = calcPnL(t);
                return (
                  <tr key={t.id} className="border-b border-border-main/50">
                    <td className="py-2 pr-4 text-text-secondary">{t.timestamp.slice(0, 10)}</td>
                    <td className="py-2 pr-4">{t.strategy}</td>
                    <td className={`py-2 pr-4 font-mono ${t.direction === 'LONG' ? 'text-profit' : 'text-loss'}`}>
                      {t.direction}
                    </td>
                    <td className="py-2 pr-4 text-right font-mono">{t.entryPrice}</td>
                    <td className="py-2 pr-4 text-right font-mono">{t.exitPrice}</td>
                    <td className={`py-2 text-right font-mono font-bold ${pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      ${pnl.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
