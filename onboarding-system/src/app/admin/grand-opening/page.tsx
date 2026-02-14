'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  agent_name: string;
  event_date: string;
  event_time: string;
  status: string;
  target_guests: number;
}

interface Stats { total: number; registered: number; confirmed: number; attended: number; clients: number; partners: number; }

export default function GrandOpeningDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Record<number, Stats>>({});

  useEffect(() => {
    fetch('/api/grand-opening/events').then(r => r.json()).then(async (evts: Event[]) => {
      setEvents(evts);
      const s: Record<number, Stats> = {};
      for (const e of evts) {
        const guests = await fetch(`/api/grand-opening/events/${e.id}/guests`).then(r => r.json());
        s[e.id] = {
          total: guests.length,
          registered: guests.filter((g: { rsvp_status: string }) => ['registered','confirmed','attended'].includes(g.rsvp_status)).length,
          confirmed: guests.filter((g: { rsvp_status: string }) => ['confirmed','attended'].includes(g.rsvp_status)).length,
          attended: guests.filter((g: { rsvp_status: string }) => g.rsvp_status === 'attended').length,
          clients: guests.filter((g: { became_client: number }) => g.became_client).length,
          partners: guests.filter((g: { became_partner: number }) => g.became_partner).length,
        };
      }
      setStats(s);
    });
  }, []);

  const statusColor: Record<string, string> = {
    planning: 'bg-yellow-500/20 text-yellow-400',
    inviting: 'bg-blue-500/20 text-blue-400',
    live: 'bg-green-500/20 text-green-400',
    completed: 'bg-purple-500/20 text-purple-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  const totalInvited = Object.values(stats).reduce((a, s) => a + s.total, 0);
  const totalRegistered = Object.values(stats).reduce((a, s) => a + s.registered, 0);
  const totalAttended = Object.values(stats).reduce((a, s) => a + s.attended, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🎉 Grand Opening Factory</h1>
          <p className="text-zinc-400 mt-1">Create, manage, and execute Grand Opening events</p>
        </div>
        <Link href="/grand-opening/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors">
          + New Grand Opening
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, icon: '📅' },
          { label: 'Guests Invited', value: totalInvited, icon: '✉️' },
          { label: 'RSVPs', value: totalRegistered, icon: '✅' },
          { label: 'Attended', value: totalAttended, icon: '🎯' },
        ].map(s => (
          <div key={s.label} className="bg-[#111] border border-[#262626] rounded-xl p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-20 bg-[#111] border border-[#262626] rounded-xl">
          <div className="text-5xl mb-4">🎊</div>
          <h2 className="text-xl font-semibold mb-2">No Grand Openings Yet</h2>
          <p className="text-zinc-400 mb-6">Create your first Grand Opening event to get started</p>
          <Link href="/grand-opening/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map(e => (
            <Link key={e.id} href={`/grand-opening/${e.id}`} className="block bg-[#111] border border-[#262626] rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{e.agent_name}&apos;s Grand Opening</h3>
                  <p className="text-zinc-400 text-sm">{new Date(e.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {e.event_time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[e.status] || 'bg-zinc-500/20 text-zinc-400'}`}>
                  {e.status}
                </span>
              </div>
              {stats[e.id] && (
                <div className="mt-4 flex gap-6 text-sm">
                  <span className="text-zinc-400">Invited: <span className="text-white font-medium">{stats[e.id].total}</span></span>
                  <span className="text-zinc-400">RSVPs: <span className="text-white font-medium">{stats[e.id].registered}</span></span>
                  <span className="text-zinc-400">Attended: <span className="text-white font-medium">{stats[e.id].attended}</span></span>
                  <span className="text-zinc-400">Clients: <span className="text-white font-medium">{stats[e.id].clients}</span></span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
