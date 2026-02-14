'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const sp = useSearchParams();
  const name = sp.get('name') || 'Guest';
  const date = sp.get('date') || '';
  const time = sp.get('time') || '';
  const tz = sp.get('tz') || '';
  const agent = sp.get('agent') || '';

  function downloadICS() {
    const dtStart = date.replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
    const dtEnd = date.replace(/-/g, '') + 'T' + String(Number(time.split(':')[0]) + 1).padStart(2, '0') + time.split(':')[1] + '00';
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:${agent}'s Grand Opening\nDESCRIPTION:Virtual Grand Opening Event\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'grand-opening.ics';
    a.click();
  }

  const dateStr = date ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const tzLabels: Record<string, string> = { 'America/New_York': 'ET', 'America/Chicago': 'CT', 'America/Denver': 'MT', 'America/Los_Angeles': 'PT' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#262626] rounded-2xl p-8 shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">You&apos;re Registered!</h1>
          <p className="text-zinc-400 mb-6">Thank you, {name}! We can&apos;t wait to see you there.</p>

          <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="text-sm"><span className="text-zinc-400">Event:</span> {agent}&apos;s Grand Opening</div>
            <div className="text-sm"><span className="text-zinc-400">Date:</span> {dateStr}</div>
            <div className="text-sm"><span className="text-zinc-400">Time:</span> {time} {tzLabels[tz] || tz}</div>
            <div className="text-sm"><span className="text-zinc-400">Format:</span> Virtual (Zoom)</div>
          </div>

          <button onClick={downloadICS}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold transition-all">
            📅 Add to Calendar
          </button>

          <p className="text-xs text-zinc-500 mt-4">You&apos;ll receive event details before the event. See you there! 🙌</p>
        </div>
      </div>
    </div>
  );
}

export default function RSVPSuccess() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-4xl">🎉</div></div>}><SuccessContent /></Suspense>;
}
