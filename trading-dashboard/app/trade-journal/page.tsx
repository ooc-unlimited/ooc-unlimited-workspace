'use client';

import { useEffect, useState } from 'react';
import { Trade, calcPnL, calcRMultiple, STRATEGY_NAMES, Direction, StrategyName } from '@/lib/types';
import { getTrades, saveTrades, addTrade, deleteTrade } from '@/lib/storage';

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

export default function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setTrades(getTrades()); }, []);

  const [form, setForm] = useState({
    direction: 'LONG' as Direction,
    strategy: 'School Run' as StrategyName,
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    contracts: '1',
    notes: '',
    mentalState: '3',
    setupQuality: '3',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trade: Trade = {
      id: genId(),
      timestamp: new Date().toISOString(),
      direction: form.direction,
      strategy: form.strategy,
      entryPrice: parseFloat(form.entryPrice),
      exitPrice: parseFloat(form.exitPrice),
      stopLoss: parseFloat(form.stopLoss),
      contracts: parseInt(form.contracts),
      notes: form.notes,
      mentalState: parseInt(form.mentalState),
      setupQuality: parseInt(form.setupQuality),
    };
    addTrade(trade);
    setTrades(getTrades());
    setShowForm(false);
    setForm({ direction: 'LONG', strategy: 'School Run', entryPrice: '', exitPrice: '', stopLoss: '', contracts: '1', notes: '', mentalState: '3', setupQuality: '3' });
  }

  function handleDelete(id: string) {
    deleteTrade(id);
    setTrades(getTrades());
  }

  function handleReset() {
    if (confirm('Clear all trades and reload sample data?')) {
      localStorage.removeItem('nq-paper-trades');
      setTrades(getTrades());
    }
  }

  const inputClass = "w-full bg-bg-tertiary border border-border-main rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent";
  const labelClass = "block text-xs text-text-secondary uppercase tracking-wide mb-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trade Journal</h1>
        <div className="flex gap-2">
          <button onClick={handleReset} className="px-3 py-1.5 text-sm rounded border border-border-main text-text-secondary hover:text-text-primary transition-colors">
            Reset Data
          </button>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-1.5 text-sm rounded bg-accent text-bg-primary font-medium hover:opacity-90 transition-opacity">
            {showForm ? 'Cancel' : '+ New Trade'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-bg-secondary border border-border-main rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Direction</label>
              <select value={form.direction} onChange={e => setForm({...form, direction: e.target.value as Direction})} className={inputClass}>
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Strategy</label>
              <select value={form.strategy} onChange={e => setForm({...form, strategy: e.target.value as StrategyName})} className={inputClass}>
                {STRATEGY_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Contracts</label>
              <input type="number" min="1" value={form.contracts} onChange={e => setForm({...form, contracts: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Mental State (1-5)</label>
              <input type="number" min="1" max="5" value={form.mentalState} onChange={e => setForm({...form, mentalState: e.target.value})} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Entry Price</label>
              <input type="number" step="0.25" required value={form.entryPrice} onChange={e => setForm({...form, entryPrice: e.target.value})} className={inputClass} placeholder="21500.00" />
            </div>
            <div>
              <label className={labelClass}>Exit Price</label>
              <input type="number" step="0.25" required value={form.exitPrice} onChange={e => setForm({...form, exitPrice: e.target.value})} className={inputClass} placeholder="21550.00" />
            </div>
            <div>
              <label className={labelClass}>Stop Loss</label>
              <input type="number" step="0.25" required value={form.stopLoss} onChange={e => setForm({...form, stopLoss: e.target.value})} className={inputClass} placeholder="21470.00" />
            </div>
            <div>
              <label className={labelClass}>Setup Quality (1-5)</label>
              <input type="number" min="1" max="5" value={form.setupQuality} onChange={e => setForm({...form, setupQuality: e.target.value})} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className={inputClass + " h-20 resize-none"} placeholder="What did you see? What was the setup?" />
          </div>
          <button type="submit" className="px-6 py-2 rounded bg-profit text-bg-primary font-medium hover:opacity-90 transition-opacity">
            Log Trade
          </button>
        </form>
      )}

      <div className="space-y-3">
        {[...trades].reverse().map(t => {
          const pnl = calcPnL(t);
          const rMult = calcRMultiple(t);
          return (
            <div key={t.id} className="bg-bg-secondary border border-border-main rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${t.direction === 'LONG' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'}`}>
                    {t.direction}
                  </span>
                  <span className="text-sm font-medium">{t.strategy}</span>
                  <span className="text-xs text-text-secondary">{new Date(t.timestamp).toLocaleDateString()} {new Date(t.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                <button onClick={() => handleDelete(t.id)} className="text-text-secondary hover:text-loss text-xs transition-colors">✕</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                <div>
                  <span className="text-text-secondary text-xs">Entry</span>
                  <div className="font-mono">{t.entryPrice}</div>
                </div>
                <div>
                  <span className="text-text-secondary text-xs">Exit</span>
                  <div className="font-mono">{t.exitPrice}</div>
                </div>
                <div>
                  <span className="text-text-secondary text-xs">Stop</span>
                  <div className="font-mono">{t.stopLoss}</div>
                </div>
                <div>
                  <span className="text-text-secondary text-xs">R-Multiple</span>
                  <div className={`font-mono ${rMult >= 0 ? 'text-profit' : 'text-loss'}`}>{rMult.toFixed(2)}R</div>
                </div>
                <div>
                  <span className="text-text-secondary text-xs">P&L</span>
                  <div className={`font-mono font-bold ${pnl >= 0 ? 'text-profit' : 'text-loss'}`}>${pnl.toLocaleString()}</div>
                </div>
              </div>
              {t.notes && <div className="mt-2 text-xs text-text-secondary italic">{t.notes}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
