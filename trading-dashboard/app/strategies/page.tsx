'use client';

import { useState } from 'react';
import { strategies } from '@/lib/strategies';

export default function StrategyLibrary() {
  const [expanded, setExpanded] = useState<string | null>(strategies[0].name);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Strategy Library</h1>
      <p className="text-text-secondary text-sm">From Gary&apos;s NQ Trading Playbook — 6 core strategies for NQ1! futures.</p>
      <div className="space-y-3">
        {strategies.map(s => (
          <div key={s.name} className="bg-bg-secondary border border-border-main rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === s.name ? null : s.name)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-tertiary/50 transition-colors"
            >
              <div>
                <span className="font-medium text-lg">{s.name}</span>
                <span className="ml-3 text-xs text-text-secondary">{s.frequency}</span>
              </div>
              <span className="text-text-secondary text-lg">{expanded === s.name ? '−' : '+'}</span>
            </button>
            {expanded === s.name && (
              <div className="px-4 pb-4 space-y-4 border-t border-border-main pt-4">
                <p className="text-sm text-text-secondary">{s.description}</p>
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-accent mb-2">Rules</h4>
                  <ol className="space-y-1">
                    {s.rules.map((r, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-text-secondary font-mono text-xs mt-0.5">{i + 1}.</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-warning mb-2">Stop Loss</h4>
                  <p className="text-sm">{s.stopLoss}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-purple mb-2">Key Notes</h4>
                  <ul className="space-y-1">
                    {s.keyNotes.map((n, i) => (
                      <li key={i} className="text-sm text-text-secondary flex gap-2">
                        <span>•</span><span>{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
