'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Guest { id: number; name: string; phone: string; email: string; rsvp_status: string; became_client: number; became_partner: number; follow_up_status: string; follow_up_notes: string; }
interface Event { id: number; agent_name: string; event_title: string; }

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="px-3 py-1 text-xs bg-[#1a1a1a] border border-[#333] rounded hover:bg-[#222]">
      {copied ? '✅ Copied!' : '📋 Copy'}
    </button>
  );
}

export default function FollowUpPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tab, setTab] = useState<'attended' | 'no_show'>('attended');

  const load = useCallback(async () => {
    const [e, g] = await Promise.all([
      fetch(`/api/grand-opening/events/${id}`).then(r => r.json()),
      fetch(`/api/grand-opening/events/${id}/guests`).then(r => r.json()),
    ]);
    setEvent(e); setGuests(g);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function updateGuest(guestId: number, data: Partial<Guest>) {
    await fetch(`/api/grand-opening/events/${id}/guests`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: guestId, ...data }),
    });
    load();
  }

  if (!event) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-4xl">📋</div></div>;

  const attended = guests.filter(g => g.rsvp_status === 'attended');
  const noShows = guests.filter(g => g.rsvp_status === 'no_show' || (g.rsvp_status !== 'attended' && ['registered', 'confirmed', 'invited'].includes(g.rsvp_status)));

  const noShowScript = (name: string) => `Hey ${name}, I'm sorry you missed my grand opening, but you can still potentially help me. I'm up for a promotion. I have to witness 10 field trainings. The good news is I've already seen 7. I just need 3 more. That's why I'm messaging you. Can I count on you?`;

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/grand-opening/${id}`} className="text-zinc-400 hover:text-white text-sm">← Back to Event</Link>
        <h1 className="text-2xl font-bold mt-2">📋 Follow-Up Dashboard</h1>
        <p className="text-zinc-400">{event.agent_name}&apos;s {event.event_title}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-[#262626] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{attended.length}</div>
          <div className="text-sm text-zinc-400">Attended</div>
        </div>
        <div className="bg-[#111] border border-[#262626] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{noShows.length}</div>
          <div className="text-sm text-zinc-400">No Shows / Pending</div>
        </div>
        <div className="bg-[#111] border border-[#262626] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{guests.filter(g => g.became_client).length}</div>
          <div className="text-sm text-zinc-400">Clients</div>
        </div>
        <div className="bg-[#111] border border-[#262626] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{guests.filter(g => g.became_partner).length}</div>
          <div className="text-sm text-zinc-400">Partners</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('attended')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'attended' ? 'bg-green-600' : 'bg-[#111] text-zinc-400'}`}>
          ✅ Attendees ({attended.length})
        </button>
        <button onClick={() => setTab('no_show')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'no_show' ? 'bg-red-600' : 'bg-[#111] text-zinc-400'}`}>
          ❌ No Shows ({noShows.length})
        </button>
      </div>

      {tab === 'attended' && (
        <div className="space-y-3">
          {attended.length === 0 && <p className="text-zinc-500 text-center py-8">No attendees marked yet. Go to the guest list to mark attendance.</p>}
          {attended.map(g => (
            <div key={g.id} className="bg-[#111] border border-[#262626] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-sm text-zinc-400">{g.phone || g.email || '—'}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateGuest(g.id, { became_client: g.became_client ? 0 : 1 })}
                    className={`px-3 py-1 rounded text-xs font-medium ${g.became_client ? 'bg-green-600' : 'bg-[#1a1a1a] border border-[#333]'}`}>
                    {g.became_client ? '✅ Client' : 'Mark Client'}
                  </button>
                  <button onClick={() => updateGuest(g.id, { became_partner: g.became_partner ? 0 : 1 })}
                    className={`px-3 py-1 rounded text-xs font-medium ${g.became_partner ? 'bg-purple-600' : 'bg-[#1a1a1a] border border-[#333]'}`}>
                    {g.became_partner ? '✅ Partner' : 'Mark Partner'}
                  </button>
                  <select value={g.follow_up_status} onChange={e => updateGuest(g.id, { follow_up_status: e.target.value })}
                    className="px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-xs">
                    <option value="none">No Follow-Up</option><option value="contacted">Contacted</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'no_show' && (
        <div className="space-y-4">
          {/* No-show script */}
          <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6 space-y-3">
            <h3 className="font-semibold text-red-400">📱 No-Show Follow-Up Script</h3>
            <p className="text-sm text-zinc-300 italic">&quot;Hey [name], I&apos;m sorry you missed my grand opening, but you can still potentially help me. I&apos;m up for a promotion. I have to witness 10 field trainings. The good news is I&apos;ve already seen 7. I just need 3 more. That&apos;s why I&apos;m messaging you. Can I count on you?&quot;</p>
          </div>

          {/* Redirect options */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6 space-y-3">
            <h3 className="font-semibold">🔄 Redirect Options for No-Shows</h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-[#0a0a0a] rounded-lg">1️⃣ <strong>Company Overview</strong> — Every Saturday 11 AM Pacific</div>
              <div className="p-3 bg-[#0a0a0a] rounded-lg">2️⃣ <strong>Prolific Daily Overview</strong> — Every day 10 AM Pacific / 1 PM Eastern</div>
              <div className="p-3 bg-[#0a0a0a] rounded-lg">3️⃣ <strong>Send Recording</strong> → Set up 1-on-1 field training</div>
            </div>
          </div>

          {noShows.length === 0 && <p className="text-zinc-500 text-center py-8">No no-shows yet.</p>}
          {noShows.map(g => (
            <div key={g.id} className="bg-[#111] border border-[#262626] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-sm text-zinc-400">{g.phone || g.email || '—'}</div>
                </div>
                <select value={g.follow_up_status} onChange={e => updateGuest(g.id, { follow_up_status: e.target.value })}
                  className="px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-xs">
                  <option value="none">No Follow-Up</option><option value="contacted">Contacted</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option>
                </select>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-3">
                <p className="text-sm text-zinc-300">{noShowScript(g.name)}</p>
                <div className="mt-2"><CopyBtn text={noShowScript(g.name)} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
