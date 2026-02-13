'use client';

import { Trade } from './types';
import { sampleTrades } from './sample-data';

const KEY = 'nq-paper-trades';

export function getTrades(): Trade[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    // seed sample data on first load
    localStorage.setItem(KEY, JSON.stringify(sampleTrades));
    return sampleTrades;
  }
  return JSON.parse(raw);
}

export function saveTrades(trades: Trade[]) {
  localStorage.setItem(KEY, JSON.stringify(trades));
}

export function addTrade(trade: Trade) {
  const trades = getTrades();
  trades.push(trade);
  saveTrades(trades);
}

export function deleteTrade(id: string) {
  const trades = getTrades().filter(t => t.id !== id);
  saveTrades(trades);
}
