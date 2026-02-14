'use client';

import { SMS_TEMPLATES } from '@/lib/sms-templates';
import { STAGES } from '@/lib/stages';

export default function SmsTemplatesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SMS Templates</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Automated text message sequences for each pipeline stage. Ringy integration coming in Phase 2.
        </p>
      </div>

      <div className="space-y-4">
        {SMS_TEMPLATES.map(t => {
          const stage = t.stage ? STAGES.find(s => s.id === t.stage) : null;
          return (
            <div key={t.id} className="bg-[#111111] border border-[#262626] rounded-xl p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Trigger: {t.trigger}</p>
                </div>
                {stage && (
                  <span className="text-xs px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: stage.color + '20', color: stage.color }}>
                    {stage.short}
                  </span>
                )}
              </div>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {t.content}
                </pre>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => { navigator.clipboard.writeText(t.content); alert('Copied to clipboard!'); }}
                  className="text-xs bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-zinc-400 px-3 py-1.5 rounded-lg transition-colors"
                >
                  📋 Copy Text
                </button>
                <button className="text-xs bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-zinc-400 px-3 py-1.5 rounded-lg transition-colors opacity-50 cursor-not-allowed" title="Coming in Phase 2">
                  📱 Send via Ringy (Phase 2)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
