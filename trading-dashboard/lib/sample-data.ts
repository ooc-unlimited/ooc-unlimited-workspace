import { Trade } from './types';

export const sampleTrades: Trade[] = [
  {
    id: '1', timestamp: '2026-02-03T10:02:00', direction: 'LONG', strategy: 'School Run',
    entryPrice: 21452, exitPrice: 21498, stopLoss: 21420, contracts: 1,
    notes: 'Clean break above bar 4 high. Trailed with prior bar lows.', mentalState: 4, setupQuality: 5,
  },
  {
    id: '2', timestamp: '2026-02-03T11:15:00', direction: 'SHORT', strategy: 'High 5',
    entryPrice: 21510, exitPrice: 21485, stopLoss: 21530, contracts: 1,
    notes: 'H1 signal fired on 5-min, entered on 1-min pullback.', mentalState: 4, setupQuality: 4,
  },
  {
    id: '3', timestamp: '2026-02-04T09:55:00', direction: 'LONG', strategy: 'School Run',
    entryPrice: 21380, exitPrice: 21355, stopLoss: 21350, contracts: 1,
    notes: 'Got stopped out — choppy open. Whipsaw day.', mentalState: 3, setupQuality: 3,
  },
  {
    id: '4', timestamp: '2026-02-04T10:05:00', direction: 'SHORT', strategy: 'School Run',
    entryPrice: 21350, exitPrice: 21290, stopLoss: 21380, contracts: 1,
    notes: 'Stop and reverse worked. Rode it down 60 pts.', mentalState: 3, setupQuality: 4,
  },
  {
    id: '5', timestamp: '2026-02-05T14:35:00', direction: 'LONG', strategy: 'FOMC Breakout',
    entryPrice: 21600, exitPrice: 21752, stopLoss: 21555, contracts: 1,
    notes: 'Press conference bar breakout. Held to close. +152 pts!', mentalState: 5, setupQuality: 5,
  },
  {
    id: '6', timestamp: '2026-02-06T10:00:00', direction: 'LONG', strategy: 'School Run',
    entryPrice: 21780, exitPrice: 21830, stopLoss: 21750, contracts: 1,
    notes: 'Continuation from FOMC momentum. Clean setup.', mentalState: 4, setupQuality: 4,
  },
  {
    id: '7', timestamp: '2026-02-06T11:30:00', direction: 'LONG', strategy: 'Phantom',
    entryPrice: 21840, exitPrice: 21815, stopLoss: 21820, contracts: 1,
    notes: 'Tried to catch a continuation, but momentum faded.', mentalState: 3, setupQuality: 2,
  },
  {
    id: '8', timestamp: '2026-02-07T09:52:00', direction: 'SHORT', strategy: 'School Run',
    entryPrice: 21700, exitPrice: 21660, stopLoss: 21730, contracts: 1,
    notes: 'Gap down open. Bar 4 short triggered cleanly.', mentalState: 4, setupQuality: 5,
  },
  {
    id: '9', timestamp: '2026-02-07T10:45:00', direction: 'SHORT', strategy: 'High 5',
    entryPrice: 21650, exitPrice: 21625, stopLoss: 21670, contracts: 1,
    notes: 'H1 continuation short. Quick 25 pt scalp.', mentalState: 4, setupQuality: 4,
  },
  {
    id: '10', timestamp: '2026-02-07T14:00:00', direction: 'LONG', strategy: 'Harmonic Patterns',
    entryPrice: 21580, exitPrice: 21640, stopLoss: 21540, contracts: 1,
    notes: 'AB=CD completion at prior swing low. 4H chart setup.', mentalState: 4, setupQuality: 5,
  },
];
