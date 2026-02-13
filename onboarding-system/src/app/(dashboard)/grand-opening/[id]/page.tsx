'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Event { id: number; agent_name: string; agent_phone: string; agent_email: string; agent_story: string; event_title: string; event_date: string; event_time: string; event_timezone: string; zoom_link: string; trainer_name: string; status: string; target_guests: number; checklist_state: string; }
interface Guest { id: number; name: string; phone: string; email: string; category: string; relationship: string; rsvp_status: string; became_client: number; became_partner: number; follow_up_status: string; follow_up_notes: string; macho_score: number; }
interface Post { id: number; platform: string; post_type: string; content: string; suggested_date: string; posted: number; }

const CHECKLIST_ITEMS = [
  'Have a professional flyer ready',
  'Upline has set up the grand opening logistics',
  'Sent invites via social media + text',
  'Collected phone numbers from social contacts',
  'Invited 100+ guests',
  'Ensured guests have Zoom + correct timezone',
  'Day-before follow-up sent to ALL',
  'No-shows redirected to field training',
  'Day-of morning confirmation sent',
  'Rehearsed the grand opening with trainer',
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="px-3 py-1 text-xs bg-[#1a1a1a] border border-[#333] rounded hover:bg-[#222] transition-colors">
      {copied ? '✅ Copied!' : '📋 Copy'}
    </button>
  );
}

export default function EventDetail() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState('overview');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [newGuest, setNewGuest] = useState({ name: '', phone: '', email: '', category: 'warm', relationship: '' });
  const [filter, setFilter] = useState('all');
  const [csvText, setCsvText] = useState('');

  const load = useCallback(async () => {
    const [e, g, p, c] = await Promise.all([
      fetch(`/api/grand-opening/events/${id}`).then(r => r.json()),
      fetch(`/api/grand-opening/events/${id}/guests`).then(r => r.json()),
      fetch(`/api/grand-opening/events/${id}/social`).then(r => r.json()),
      fetch(`/api/grand-opening/events/${id}/checklist`).then(r => r.json()),
    ]);
    setEvent(e); setGuests(g); setPosts(p); setChecklist(c);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!event) return <div className="flex items-center justify-center h-64"><div className="animate-spin text-4xl">🎯</div></div>;

  const daysUntil = Math.ceil((new Date(event.event_date).getTime() - Date.now()) / 86400000);
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/grand-opening/${id}/invite` : '';

  async function addGuest() {
    if (!newGuest.name) return;
    await fetch(`/api/grand-opening/events/${id}/guests`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGuest),
    });
    setNewGuest({ name: '', phone: '', email: '', category: 'warm', relationship: '' });
    load();
  }

  async function importCSV() {
    const lines = csvText.trim().split('\n').filter(Boolean);
    const imported = lines.map(line => {
      const [name, phone, email] = line.split(',').map(s => s.trim());
      return { name, phone: phone || '', email: email || '' };
    }).filter(g => g.name);
    if (imported.length === 0) return;
    await fetch(`/api/grand-opening/events/${id}/guests`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guests: imported }),
    });
    setCsvText('');
    load();
  }

  async function updateGuestField(guestId: number, data: Partial<Guest>) {
    await fetch(`/api/grand-opening/events/${id}/guests`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: guestId, ...data }),
    });
    load();
  }

  async function deleteGuest(guestId: number) {
    await fetch(`/api/grand-opening/events/${id}/guests`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: guestId }),
    });
    load();
  }

  async function toggleChecklist(key: string) {
    const next = { ...checklist, [key]: !checklist[key] };
    setChecklist(next);
    await fetch(`/api/grand-opening/events/${id}/checklist`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
  }

  async function updateStatus(status: string) {
    await fetch(`/api/grand-opening/events/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const filteredGuests = guests.filter(g => filter === 'all' || g.category === filter);
  const registered = guests.filter(g => ['registered','confirmed','attended'].includes(g.rsvp_status)).length;
  const attended = guests.filter(g => g.rsvp_status === 'attended').length;

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'guests', label: `👥 Guests (${guests.length})` },
    { key: 'outreach', label: '📱 Outreach' },
    { key: 'social', label: '📣 Social Posts' },
    { key: 'checklist', label: '✅ Checklist' },
    { key: 'share', label: '🔗 Share' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link href="/grand-opening" className="text-zinc-400 hover:text-white text-sm">← All Events</Link>
          <h1 className="text-2xl font-bold mt-1">{event.agent_name}&apos;s {event.event_title}</h1>
          <p className="text-zinc-400">{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {event.event_time}</p>
        </div>
        <div className="flex gap-2">
          <select value={event.status} onChange={e => updateStatus(e.target.value)} className="px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm">
            <option value="planning">Planning</option><option value="inviting">Inviting</option><option value="live">Live</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
          </select>
          <Link href={`/grand-opening/${id}/live`} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium">🔴 Live</Link>
          <Link href={`/grand-opening/${id}/followup`} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium">Follow-Up</Link>
          <Link href={`/grand-opening/${id}/kpi`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium">📈 KPI</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'bg-indigo-600 text-white' : 'bg-[#111] text-zinc-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Event Info</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-zinc-400">Agent:</span> {event.agent_name}</div>
              <div><span className="text-zinc-400">Trainer:</span> {event.trainer_name || 'TBD'}</div>
              <div><span className="text-zinc-400">Phone:</span> {event.agent_phone || '—'}</div>
              <div><span className="text-zinc-400">Email:</span> {event.agent_email || '—'}</div>
              <div><span className="text-zinc-400">Zoom:</span> {event.zoom_link ? <a href={event.zoom_link} className="text-indigo-400 underline" target="_blank">Join</a> : 'Not set'}</div>
              <div><span className="text-zinc-400">Status:</span> <span className="capitalize">{event.status}</span></div>
            </div>
          </div>
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6 text-center">
            <div className="text-6xl font-bold text-indigo-400">{daysUntil}</div>
            <div className="text-zinc-400 mt-2">{daysUntil > 0 ? 'days until event' : daysUntil === 0 ? "IT'S TODAY! 🎉" : 'days since event'}</div>
          </div>
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3">Pipeline</h2>
            <div className="space-y-2">
              {[
                { label: 'Invited', count: guests.length, target: event.target_guests, color: 'bg-blue-500' },
                { label: 'Registered', count: registered, target: 60, color: 'bg-indigo-500' },
                { label: 'Attended', count: attended, target: 30, color: 'bg-green-500' },
                { label: 'Clients', count: guests.filter(g => g.became_client).length, target: 10, color: 'bg-yellow-500' },
                { label: 'Partners', count: guests.filter(g => g.became_partner).length, target: 3, color: 'bg-purple-500' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1"><span>{s.label}</span><span>{s.count}/{s.target}</span></div>
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden"><div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${Math.min(100, (s.count / s.target) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3">Preparation</h2>
            <div className="text-3xl font-bold text-green-400">{Object.values(checklist).filter(Boolean).length}/{CHECKLIST_ITEMS.length}</div>
            <div className="text-sm text-zinc-400 mt-1">checklist items completed</div>
            <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden mt-3"><div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(Object.values(checklist).filter(Boolean).length / CHECKLIST_ITEMS.length) * 100}%` }} /></div>
          </div>
        </div>
      )}

      {tab === 'guests' && (
        <div className="space-y-4">
          {/* Add guest form */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <input className="px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm" placeholder="Name *" value={newGuest.name} onChange={e => setNewGuest(g => ({ ...g, name: e.target.value }))} />
              <input className="px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm" placeholder="Phone" value={newGuest.phone} onChange={e => setNewGuest(g => ({ ...g, phone: e.target.value }))} />
              <input className="px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm" placeholder="Email" value={newGuest.email} onChange={e => setNewGuest(g => ({ ...g, email: e.target.value }))} />
              <select className="px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm" value={newGuest.category} onChange={e => setNewGuest(g => ({ ...g, category: e.target.value }))}>
                <option value="warm">🔥 Warm</option><option value="reconnect">🔄 Reconnect</option><option value="cold">❄️ Cold</option>
              </select>
              <input className="px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm" placeholder="Relationship" value={newGuest.relationship} onChange={e => setNewGuest(g => ({ ...g, relationship: e.target.value }))} />
              <button onClick={addGuest} className="py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium">+ Add</button>
            </div>
            {/* CSV Import */}
            <details className="mt-3">
              <summary className="text-sm text-zinc-400 cursor-pointer hover:text-white">Bulk Import CSV</summary>
              <div className="mt-2 flex gap-2">
                <textarea className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm h-20" placeholder="name, phone, email (one per line)" value={csvText} onChange={e => setCsvText(e.target.value)} />
                <button onClick={importCSV} className="px-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm">Import</button>
              </div>
            </details>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {['all', 'warm', 'reconnect', 'cold'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-sm capitalize ${filter === f ? 'bg-indigo-600' : 'bg-[#1a1a1a] text-zinc-400'}`}>{f}</button>
            ))}
          </div>

          {/* Guest table */}
          <div className="bg-[#111] border border-[#262626] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#1a1a1a]"><tr>
                  <th className="text-left p-3">Name</th><th className="text-left p-3">Category</th><th className="text-left p-3">RSVP</th><th className="text-left p-3">MACHO</th><th className="text-left p-3">Follow-Up</th><th className="p-3">Actions</th>
                </tr></thead>
                <tbody>
                  {filteredGuests.map(g => (
                    <tr key={g.id} className="border-t border-[#262626] hover:bg-[#1a1a1a]">
                      <td className="p-3">
                        <div className="font-medium">{g.name}</div>
                        <div className="text-xs text-zinc-500">{g.phone || g.email || '—'}{g.relationship ? ` · ${g.relationship}` : ''}</div>
                      </td>
                      <td className="p-3 capitalize">{g.category}</td>
                      <td className="p-3">
                        <select value={g.rsvp_status} onChange={e => updateGuestField(g.id, { rsvp_status: e.target.value } as Partial<Guest>)}
                          className="px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-xs">
                          <option value="invited">Invited</option><option value="registered">Registered</option><option value="confirmed">Confirmed</option><option value="attended">Attended</option><option value="no_show">No Show</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select value={g.macho_score} onChange={e => updateGuestField(g.id, { macho_score: Number(e.target.value) } as Partial<Guest>)}
                          className="px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-xs w-16">
                          {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <select value={g.follow_up_status} onChange={e => updateGuestField(g.id, { follow_up_status: e.target.value } as Partial<Guest>)}
                          className="px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-xs">
                          <option value="none">None</option><option value="contacted">Contacted</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => updateGuestField(g.id, { became_client: g.became_client ? 0 : 1 } as Partial<Guest>)}
                            className={`px-2 py-1 rounded text-xs ${g.became_client ? 'bg-green-600' : 'bg-[#1a1a1a] border border-[#333]'}`}>
                            {g.became_client ? '✅ Client' : 'Client'}
                          </button>
                          <button onClick={() => updateGuestField(g.id, { became_partner: g.became_partner ? 0 : 1 } as Partial<Guest>)}
                            className={`px-2 py-1 rounded text-xs ${g.became_partner ? 'bg-purple-600' : 'bg-[#1a1a1a] border border-[#333]'}`}>
                            {g.became_partner ? '✅ Partner' : 'Partner'}
                          </button>
                          <button onClick={() => deleteGuest(g.id)} className="px-2 py-1 rounded text-xs bg-red-600/20 text-red-400 hover:bg-red-600/40">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredGuests.length === 0 && <div className="p-8 text-center text-zinc-500">No guests yet. Add some above!</div>}
          </div>
        </div>
      )}

      {tab === 'outreach' && (
        <div className="space-y-6">
          {[
            {
              title: '🔥 Warmest Market',
              desc: 'Your closest friends, family, and supporters',
              template: `Hey [name], I'm doing a relaunch of my business. Your support would mean the world. Can I count on you? ${new Date(event.event_date).toLocaleDateString()} at ${event.event_time}`,
            },
            {
              title: '🔄 Reconnect Market',
              desc: 'People you haven\'t talked to in a while',
              template: `Hey [name], it's been forever. You just came to mind. How are you? How's the family?`,
              followUp: `Hey [name], so the reason I was reaching out — I'm doing a relaunch of my business and I'd love your support. I'm hosting a virtual event on ${new Date(event.event_date).toLocaleDateString()} at ${event.event_time}. Can I count on you to be there?`,
            },
            {
              title: '❄️ Cold/Professional Market',
              desc: 'Professional contacts and acquaintances',
              template: `Hi [name], I recently started a career in financial services and I'm hosting a virtual grand opening on ${new Date(event.event_date).toLocaleDateString()} at ${event.event_time}. I'd love for you to attend and see what we're building. Would you be open to joining?`,
            },
          ].map(cat => (
            <div key={cat.title} className="bg-[#111] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold">{cat.title}</h3>
              <p className="text-sm text-zinc-400">{cat.desc}</p>
              <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{cat.template}</p>
                <div className="mt-3"><CopyBtn text={cat.template} /></div>
              </div>
              {cat.followUp && (
                <div>
                  <p className="text-xs text-zinc-400 mb-2">Follow-up (after they reply):</p>
                  <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{cat.followUp}</p>
                    <div className="mt-3"><CopyBtn text={cat.followUp} /></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'social' && (
        <div className="space-y-4">
          {['announcement', 'countdown_7', 'countdown_3', 'countdown_1', 'day_of', 'post_event'].map(type => {
            const typePosts = posts.filter(p => p.post_type === type);
            if (typePosts.length === 0) return null;
            const labels: Record<string, string> = { announcement: '📢 Announcement', countdown_7: '7️⃣ 7-Day Countdown', countdown_3: '3️⃣ 3-Day Countdown', countdown_1: '1️⃣ Tomorrow!', day_of: '🚀 Day Of', post_event: '🙏 Post-Event' };
            return (
              <div key={type} className="bg-[#111] border border-[#262626] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{labels[type] || type}</h3>
                <p className="text-xs text-zinc-500 mb-3">Suggested date: {typePosts[0]?.suggested_date}</p>
                <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">{typePosts[0]?.content}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <CopyBtn text={typePosts[0]?.content || ''} />
                    {typePosts.map(p => (
                      <span key={p.id} className={`px-2 py-1 rounded text-xs capitalize ${p.posted ? 'bg-green-600/20 text-green-400' : 'bg-[#1a1a1a] text-zinc-400'}`}>
                        {p.platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'checklist' && (
        <div className="bg-[#111] border border-[#262626] rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-4">📋 Preparation Checklist</h2>
          {CHECKLIST_ITEMS.map((item, i) => {
            const key = `item_${i}`;
            const checked = checklist[key] || false;
            const isGuestCount = i === 4;
            return (
              <button key={key} onClick={() => toggleChecklist(key)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${checked ? 'bg-green-600/10 border border-green-600/30' : 'bg-[#0a0a0a] border border-[#333] hover:border-[#555]'}`}>
                <span className="text-xl">{checked ? '✅' : '⬜'}</span>
                <span className={checked ? 'line-through text-zinc-500' : ''}>{item}{isGuestCount ? ` (currently: ${guests.length})` : ''}</span>
              </button>
            );
          })}
        </div>
      )}

      {tab === 'share' && (
        <div className="bg-[#111] border border-[#262626] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">🔗 Shareable RSVP Link</h2>
          <p className="text-zinc-400 text-sm">Share this link with your guests — no login required!</p>
          <div className="flex items-center gap-3">
            <input readOnly value={inviteUrl} className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-sm" />
            <CopyBtn text={inviteUrl} />
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
            <p className="text-sm font-medium mb-2">📱 Text Message Template:</p>
            <p className="text-sm text-zinc-300">{`Hey! I'm hosting a special virtual event and I'd love for you to be there. RSVP here: ${inviteUrl}`}</p>
            <div className="mt-3"><CopyBtn text={`Hey! I'm hosting a special virtual event and I'd love for you to be there. RSVP here: ${inviteUrl}`} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
