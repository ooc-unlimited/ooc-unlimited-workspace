export interface Strategy {
  name: string;
  description: string;
  frequency: string;
  rules: string[];
  stopLoss: string;
  keyNotes: string[];
}

export const strategies: Strategy[] = [
  {
    name: 'School Run',
    description: 'Daily bread-and-butter setup based on Hougaard\'s Advanced School Run. Uses the 4th (or 5th) 5-min bar after the 9:30 AM open as a reference bar, then trades the breakout with bracket orders.',
    frequency: 'Every regular trading day (skip FOMC, half-days, holidays)',
    rules: [
      'Reference bar = 4th 5-min bar (9:45-9:50 AM ET)',
      'If bar range < 15 pts or inside bar, use 5th bar instead',
      'BUY STOP at High + 2 pts, SELL STOP at Low - 2 pts',
      'When one fills, the other becomes your stop',
      'Trail using Prior Bar Method (move stop to low/high of each completed 5-min bar)',
      'Exit by trailing stop only — no fixed target',
      'Max whipsaws per day: 2',
    ],
    stopLoss: 'Opposite side of reference bar. Trail with prior bar highs/lows.',
    keyNotes: [
      '~60-65% of days work cleanly',
      '~20% require stop-and-reverse (still profitable)',
      '~15% are chop — accept the small loss',
    ],
  },
  {
    name: 'Advanced School Run',
    description: 'Enhanced version of School Run with additional confirmation filters including DeMark Sequential and overnight range analysis for higher-probability entries.',
    frequency: 'When School Run conditions are met with extra confluence',
    rules: [
      'Same base setup as School Run',
      'Check overnight range: >200 pts = hot market (tighten stops, reduce size)',
      'Check overnight range: <80 pts = coiled market (expect directional move)',
      'Add DeMark Sequential as confirmation filter',
      'Require confluence with PDH/PDL/ONH/ONL levels',
      'Higher bar quality threshold (setup quality 4+)',
    ],
    stopLoss: 'Same as School Run with tighter management.',
    keyNotes: [
      'Fewer trades but higher win rate',
      'Best when market structure aligns with setup',
      'Skip when conflicting DeMark signals present',
    ],
  },
  {
    name: 'FOMC Breakout',
    description: 'Event-driven strategy for FOMC announcement days. Uses the 5-min bar at 2:30-2:35 PM (press conference start) as the signal bar, then trades the first close beyond its range.',
    frequency: '8 times per year (FOMC meeting days)',
    rules: [
      'Close all other positions by 1:55 PM ET',
      '2:00 PM — Statement drops. Observe, DO NOT trade yet',
      '2:30 PM — Mark the press conference bar (2:30-2:35 PM)',
      'Go LONG on first 5-min bar that CLOSES above signal bar high',
      'Go SHORT on first 5-min bar that CLOSES below signal bar low',
      'Must be a CLOSE, not just a wick — filters false breakouts',
      'Trail using prior bar method or hold until session close',
    ],
    stopLoss: 'Opposite end of signal bar, or press release bar (2:00 PM) — whichever gives more room.',
    keyNotes: [
      'High-volatility moves: 50-200+ NQ points expected',
      'Only 8 opportunities per year — don\'t miss them',
      'Signal bar is the PRESS CONFERENCE bar, not the initial release',
    ],
  },
  {
    name: 'High 5',
    description: 'H1 Pullback Scalp — quick intraday scalps using the H1 pattern on 5-min charts with 1-min pullback entries for better fills.',
    frequency: 'Multiple times per day when conditions align',
    rules: [
      'H1 Long: Current 5-min bar HIGH surpasses prior bar HIGH and closes above it',
      'H1 Short: Current 5-min bar LOW undercuts prior bar LOW and closes below it',
      'DO NOT enter on the close of the H1 bar',
      'Wait 1 minute for pullback (algos trigger pullback in ~60 seconds)',
      'Enter on 1-min pullback — saves ~10 pts on stop',
      'Stop = prior 5-min bar extreme',
      'Target: 15-25 NQ points (quick scalp)',
      'Max 3 H1 scalps per day. If first 2 lose, stop.',
    ],
    stopLoss: 'Prior 5-min bar extreme. No trailing — fixed target exit.',
    keyNotes: [
      'Only take in direction of day\'s dominant move',
      'Don\'t scalp against School Run direction',
      'Total time in trade: 2-10 minutes',
    ],
  },
  {
    name: 'Phantom',
    description: 'Based on Phantom of the Pits\' 3 Rules — a discretionary approach emphasizing position management: assume wrong until proven right, press winners, and know when to hold.',
    frequency: 'Overlay on any strategy — mindset-driven',
    rules: [
      'Rule 1: Assume you are wrong until proven right',
      'If NQ doesn\'t move in your direction within 3-5 bars, re-evaluate',
      'Rule 2: Press winners, never losers — add after 15+ pts in your favor',
      'NEVER average down on a losing position',
      'Rule 3: Know when to hold large positions',
      'When a winner is running, trail the stop — don\'t grab a quick scalp out of fear',
    ],
    stopLoss: 'Strategy-dependent. Key principle: never move stop further away.',
    keyNotes: [
      'More of a trading philosophy than a standalone strategy',
      'Apply these rules to every trade from every strategy',
      'Big money comes from sitting, not trading',
    ],
  },
  {
    name: 'Harmonic Patterns',
    description: 'Swing/position strategy using Fibonacci-based harmonic patterns (AB=CD, Gartley, Butterfly, Three Drives) on daily and 4H charts with lower timeframe confirmation.',
    frequency: '2-5 setups per month on NQ daily/4H charts',
    rules: [
      'AB=CD: CD leg = AB leg in price and time. Enter at D-point completion.',
      'Gartley "222": B at .618 of XA, D at .786 of XA. Enter at D.',
      'Butterfly: D beyond X at 1.27 or 1.618 extension of XA.',
      'Three Drives: Each drive at 1.27 or 1.618 of prior drive.',
      'Enter on lower timeframe confirmation (5-min or 15-min reversal at D-point)',
      'Target: .382 and .618 retracement of entire pattern',
      'Pattern failure = valid signal in opposite direction',
    ],
    stopLoss: 'Beyond pattern\'s X point (Gartley/Butterfly) or beyond 1.618 extension.',
    keyNotes: [
      'Highest probability when multiple Fibonacci levels converge',
      'Look for AB=CD aligning with .786 retracement',
      'Confluence with prior swing highs/lows and round numbers',
    ],
  },
];
