'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Guest { rsvp_status: string; became_client: number; became_partner: number; }
interface Event { id: number; agent_name: string; event_title: string; event_date: string; target_guests: number; created_at: string; }

export default function KPIPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/grand-opening/events/${id}`).then(r => r.json()),
      fetch(`/api/grand-opening/events/${id}/guests`).then(r => r.json()),
    ]).then(([e, g]) => { setEvent(e); setGuests(g); });
  }, [id]);

  if (!event) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-4xl">📈</div></div>;

  const invited = guests.length;
  const registered = guests.filter(g => ['registered','confirmed','attended'].includes(g.rsvp_status)).length;
  const confirmed = guests.filter(g => ['confirmed','attended'].includes(g.rsvp_status)).length;
  const attended = guests.filter(g => g.rsvp_status === 'attended').length;
  const clients = guests.filter(g => g.became_client).length;
  const partners = guests.filter(g => g.became_partner).length;

  const funnel = [
    { label: 'Invited', count: invited, target: 100, color: 'from-blue-500 to-blue-600' },
    { label: 'Registered', count: registered, target: 60, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Confirmed', count: confirmed, target: 40, color: 'from-violet-500 to-violet-600' },
    { label: 'Attended', count: attended, target: 30, color: 'from-green-500 to-green-600' },
    { label: 'Client', count: clients, target: 10, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Business Partner', count: partners, target: 3, color: 'from-purple-500 to-purple-600' },
  ];

  const maxCount = Math.max(invited, 1);

  function statusColor(count: number, target: number): string {
    const ratio = count / target;
    if (ratio >= 1) return 'text-green-400';
    if (ratio >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  }

  // 3-3-30 tracker
  const daysSinceCreation = Math.ceil((Date.now() - new Date(event.created_at).getTime()) / 86400000);

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/grand-opening/${id}`} className="text-zinc-400 hover:text-white text-sm">← Back to Event</Link>
        <h1 className="text-2xl font-bold mt-2">📈 KPI Dashboard</h1>
        <p className="text-zinc-400">{event.agent_name}&apos;s {event.event_title}</p>
      </div>

      {/* 3-3-30 Target */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">🎯 3-3-30 Target Tracker</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-4xl font-bold ${clients >= 3 ? 'text-green-400' : 'text-yellow-400'}`}>{clients}/3</div>
            <div className="text-sm text-zinc-400 mt-1">Clients</div>
            {clients >= 3 && <span className="text-green-400 text-xs">✅ Target Hit!</span>}
          </div>
          <div>
            <div className={`text-4xl font-bold ${partners >= 3 ? 'text-green-400' : 'text-yellow-400'}`}>{partners}/3</div>
            <div className="text-sm text-zinc-400 mt-1">Business Partners</div>
            {partners >= 3 && <span className="text-green-400 text-xs">✅ Target Hit!</span>}
          </div>
          <div>
            <div className={`text-4xl font-bold ${daysSinceCreation <= 30 ? 'text-green-400' : 'text-red-400'}`}>{daysSinceCreation}/30</div>
            <div className="text-sm text-zinc-400 mt-1">Days</div>
            {daysSinceCreation <= 30 && <span className="text-green-400 text-xs">⏰ On Track</span>}
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">📊 Conversion Funnel</h2>
        <div className="space-y-4">
          {funnel.map((step, i) => {
            const width = Math.max(10, (step.count / maxCount) * 100);
            const pct = i > 0 && funnel[i - 1].count > 0 ? Math.round((step.count / funnel[i - 1].count) * 100) : i === 0 ? 100 : 0;
            return (
              <div key={step.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={statusColor(step.count, step.target)}>
                      {step.count} <span className="text-zinc-500">/ {step.target} target</span>
                    </span>
                    {i > 0 && <span className="text-xs text-zinc-500">{pct}% conv</span>}
                  </div>
                </div>
                <div className="h-8 bg-[#1a1a1a] rounded-lg overflow-hidden relative">
                  <div className={`h-full bg-gradient-to-r ${step.color} rounded-lg transition-all duration-1000 flex items-center justify-end pr-3`}
                    style={{ width: `${width}%` }}>
                    <span className="text-xs font-bold drop-shadow">{step.count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benchmarks */}
      <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">📋 Benchmarks (from training)</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
          {[
            { label: '100 Invited', check: invited >= 100 },
            { label: '60 Registered', check: registered >= 60 },
            { label: '30 Show Up', check: attended >= 30 },
            { label: '10 Move Forward', check: clients >= 10 },
            { label: '3-3-30 Goal', check: clients >= 3 && partners >= 3 && daysSinceCreation <= 30 },
          ].map(b => (
            <div key={b.label} className={`p-3 rounded-lg border ${b.check ? 'bg-green-600/10 border-green-600/30 text-green-400' : 'bg-[#0a0a0a] border-[#333] text-zinc-400'}`}>
              <div className="text-lg mb-1">{b.check ? '✅' : '⬜'}</div>
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
