export type Direction = 'LONG' | 'SHORT';

export type StrategyName =
  | 'School Run'
  | 'Advanced School Run'
  | 'FOMC Breakout'
  | 'High 5'
  | 'Phantom'
  | 'Harmonic Patterns';

export interface Trade {
  id: string;
  timestamp: string;
  direction: Direction;
  strategy: StrategyName;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  contracts: number;
  notes: string;
  mentalState: number;
  setupQuality: number;
}

export const POINT_VALUE = 20; // $20 per point per contract (NQ)
export const TICK_VALUE = 5;   // $5 per tick (0.25 pt)

export function calcPnL(trade: Trade): number {
  const pts = trade.direction === 'LONG'
    ? trade.exitPrice - trade.entryPrice
    : trade.entryPrice - trade.exitPrice;
  return pts * POINT_VALUE * trade.contracts;
}

export function calcRiskPts(trade: Trade): number {
  return Math.abs(trade.entryPrice - trade.stopLoss);
}

export function calcRewardPts(trade: Trade): number {
  const pts = trade.direction === 'LONG'
    ? trade.exitPrice - trade.entryPrice
    : trade.entryPrice - trade.exitPrice;
  return pts;
}

export function calcRMultiple(trade: Trade): number {
  const risk = calcRiskPts(trade);
  if (risk === 0) return 0;
  return calcRewardPts(trade) / risk;
}

export const STRATEGY_NAMES: StrategyName[] = [
  'School Run',
  'Advanced School Run',
  'FOMC Breakout',
  'High 5',
  'Phantom',
  'Harmonic Patterns',
];
