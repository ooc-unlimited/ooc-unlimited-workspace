'use client';

import { useEffect, useState } from 'react';
import { Trade, calcPnL, calcRMultiple, STRATEGY_NAMES } from '@/lib/types';
import { getTrades } from '@/lib/storage';
import StatCard from '../components/StatCard';

export default function Performance() {
  const [trades, setTrades] = useState<Trade[]>([]);
  useEffect(() => { setTrades(getTrades()); }, []);

  // by strategy
  const byStrategy = STRATEGY_NAMES.map(name => {
    const st = trades.filter(t => t.strategy === name);
    const wins = st.filter(t => calcPnL(t) > 0).length;
    const totalPnl = st.reduce((s, t) => s + calcPnL(t), 0);
    const avgR = st.length ? st.reduce((s, t) => s + calcRMultiple(t), 0) / st.length : 0;
    return { name, count: st.length, wins, winRate: st.length ? (wins / st.length * 100) : 0, totalPnl, avgR };
  }).filter(s => s.count > 0);

  // best/worst days
  const byDay: Record<string, number> = {};
  trades.forEach(t => {
    const day = t.timestamp.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + calcPnL(t);
  });
  const days = Object.entries(byDay).sort(([, a], [, b]) => b - a);
  const bestDay = days[0];
  const worstDay = days[days.length - 1];

  // streaks
  const sortedTrades = [...trades].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  let maxWin = 0, maxLoss = 0, curWin = 0, curLoss = 0;
  sortedTrades.forEach(t => {
    if (calcPnL(t) > 0) { curWin++; curLoss = 0; maxWin = Math.max(maxWin, curWin); }
    else { curLoss++; curWin = 0; maxLoss = Math.max(maxLoss, curLoss); }
  });

  // overall stats
  const totalPnL = trades.reduce((s, t) => s + calcPnL(t), 0);
  const winners = trades.filter(t => calcPnL(t) > 0);
  const losers = trades.filter(t => calcPnL(t) < 0);
  const avgWinR = winners.length ? winners.reduce((s, t) => s + calcRMultiple(t), 0) / winners.length : 0;
  const avgLossR = losers.length ? losers.reduce((s, t) => s + calcRMultiple(t), 0) / losers.length : 0;
  const profitFactor = losers.length
    ? Math.abs(winners.reduce((s, t) => s + calcPnL(t), 0)) / Math.abs(losers.reduce((s, t) => s + calcPnL(t), 0))
    : winners.length ? Infinity : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Performance</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Profit Factor" value={profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)} color="text-accent" />
        <StatCard label="Avg Win (R)" value={`${avgWinR.toFixed(2)}R`} color="text-profit" />
        <StatCard label="Avg Loss (R)" value={`${avgLossR.toFixed(2)}R`} color="text-loss" />
        <StatCard label="Total P&L" value={`$${totalPnL.toLocaleString()}`} color={totalPnL >= 0 ? 'text-profit' : 'text-loss'} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Best Day" value={bestDay ? `$${bestDay[1].toLocaleString()}` : '—'} sub={bestDay?.[0]} color="text-profit" />
        <StatCard label="Worst Day" value={worstDay ? `$${worstDay[1].toLocaleString()}` : '—'} sub={worstDay?.[0]} color="text-loss" />
        <StatCard label="Win Streak" value={`${maxWin}`} color="text-profit" />
        <StatCard label="Loss Streak" value={`${maxLoss}`} color="text-loss" />
      </div>

      <div className="bg-bg-secondary border border-border-main rounded-lg p-4">
        <h3 className="text-sm text-text-secondary mb-4 uppercase tracking-wide">Win Rate by Strategy</h3>
        <div className="space-y-3">
          {byStrategy.map(s => (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{s.name}</span>
                <div className="flex gap-4 text-xs text-text-secondary">
                  <span>{s.count} trades</span>
                  <span className={s.totalPnl >= 0 ? 'text-profit' : 'text-loss'}>${s.totalPnl.toLocaleString()}</span>
                  <span>Avg {s.avgR.toFixed(2)}R</span>
                </div>
              </div>
              <div className="w-full bg-bg-tertiary rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${s.winRate}%`,
                    background: s.winRate >= 60 ? '#3fb950' : s.winRate >= 40 ? '#d29922' : '#f85149',
                  }}
                />
              </div>
              <div className="text-xs text-text-secondary mt-0.5">{s.winRate.toFixed(0)}% win rate ({s.wins}/{s.count})</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
