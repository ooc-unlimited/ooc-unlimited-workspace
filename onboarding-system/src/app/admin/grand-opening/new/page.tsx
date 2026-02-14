'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewGrandOpening() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    agent_name: '', agent_phone: '', agent_email: '',
    event_date: '', event_time: '19:00', event_timezone: 'America/New_York',
    zoom_link: '', trainer_name: '', agent_story: '', target_guests: 100,
  });
  const [csvText, setCsvText] = useState('');
  const [guests, setGuests] = useState<Array<{ name: string; phone: string; email: string; category: string; relationship: string }>>([]);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '', email: '', category: 'warm', relationship: '' });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  function addGuest() {
    if (!newGuest.name) return;
    setGuests(g => [...g, { ...newGuest }]);
    setNewGuest({ name: '', phone: '', email: '', category: 'warm', relationship: '' });
  }

  function importCSV() {
    const lines = csvText.trim().split('\n').filter(Boolean);
    const imported = lines.map(line => {
      const [name, phone, email] = line.split(',').map(s => s.trim());
      return { name: name || '', phone: phone || '', email: email || '', category: 'warm', relationship: '' };
    }).filter(g => g.name);
    setGuests(g => [...g, ...imported]);
    setCsvText('');
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/grand-opening/events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const event = await res.json();
      if (guests.length > 0) {
        await fetch(`/api/grand-opening/events/${event.id}/guests`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guests }),
        });
      }
      router.push(`/grand-opening/${event.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }

  const inputCls = 'w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-indigo-500 focus:outline-none';
  const labelCls = 'block text-sm font-medium text-zinc-300 mb-1';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">🎊 Create Grand Opening</h1>
      <p className="text-zinc-400 mb-8">Set up everything for a successful event</p>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {['Agent Info', 'Event Details', 'Your Story', 'Guest List'].map((label, i) => (
          <button key={label} onClick={() => setStep(i + 1)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${step === i + 1 ? 'bg-indigo-600 text-white' : step > i + 1 ? 'bg-indigo-600/20 text-indigo-400' : 'bg-[#1a1a1a] text-zinc-500'}`}>
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div><label className={labelCls}>Full Name *</label><input className={inputCls} value={form.agent_name} onChange={e => set('agent_name', e.target.value)} placeholder="e.g. Marcus Johnson" /></div>
          <div><label className={labelCls}>Phone</label><input className={inputCls} value={form.agent_phone} onChange={e => set('agent_phone', e.target.value)} placeholder="(555) 123-4567" /></div>
          <div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={form.agent_email} onChange={e => set('agent_email', e.target.value)} placeholder="marcus@email.com" /></div>
          <button onClick={() => { if (!form.agent_name) { setError('Name is required'); return; } setError(''); setStep(2); }} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold">Next →</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div><label className={labelCls}>Event Date *</label><input className={inputCls} type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Time</label><input className={inputCls} type="time" value={form.event_time} onChange={e => set('event_time', e.target.value)} /></div>
            <div><label className={labelCls}>Timezone</label>
              <select className={inputCls} value={form.event_timezone} onChange={e => set('event_timezone', e.target.value)}>
                <option value="America/New_York">Eastern</option>
                <option value="America/Chicago">Central</option>
                <option value="America/Denver">Mountain</option>
                <option value="America/Los_Angeles">Pacific</option>
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Zoom Link</label><input className={inputCls} value={form.zoom_link} onChange={e => set('zoom_link', e.target.value)} placeholder="https://zoom.us/j/..." /></div>
          <div><label className={labelCls}>Trainer Name</label><input className={inputCls} value={form.trainer_name} onChange={e => set('trainer_name', e.target.value)} placeholder="Your upline trainer" /></div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg">← Back</button>
            <button onClick={() => { if (!form.event_date) { setError('Date required'); return; } setError(''); setStep(3); }} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold">Next →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Your &quot;Why&quot; Story</label>
            <p className="text-xs text-zinc-500 mb-2">Why did you get into this business? What drives you? This is what you&apos;ll share at your grand opening (keep it under 4 minutes).</p>
            <textarea className={`${inputCls} h-40`} value={form.agent_story} onChange={e => set('agent_story', e.target.value)} placeholder="I got into financial services because..." />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg">← Back</button>
            <button onClick={() => setStep(4)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold">Next →</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">Guest List Progress</span>
              <span className={guests.length >= 100 ? 'text-green-400' : 'text-yellow-400'}>{guests.length} / {form.target_guests}</span>
            </div>
            <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${guests.length >= 100 ? 'bg-green-500' : guests.length >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (guests.length / form.target_guests) * 100)}%` }} />
            </div>
          </div>

          {/* Add single guest */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-4 space-y-3">
            <h3 className="font-medium">Add Guest</h3>
            <div className="grid grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Name *" value={newGuest.name} onChange={e => setNewGuest(g => ({ ...g, name: e.target.value }))} />
              <input className={inputCls} placeholder="Phone" value={newGuest.phone} onChange={e => setNewGuest(g => ({ ...g, phone: e.target.value }))} />
              <input className={inputCls} placeholder="Email" value={newGuest.email} onChange={e => setNewGuest(g => ({ ...g, email: e.target.value }))} />
              <select className={inputCls} value={newGuest.category} onChange={e => setNewGuest(g => ({ ...g, category: e.target.value }))}>
                <option value="warm">🔥 Warmest Market</option>
                <option value="reconnect">🔄 Reconnect</option>
                <option value="cold">❄️ Cold/Professional</option>
              </select>
              <input className={inputCls} placeholder="Relationship (e.g. cousin)" value={newGuest.relationship} onChange={e => setNewGuest(g => ({ ...g, relationship: e.target.value }))} />
              <button onClick={addGuest} className="py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">+ Add</button>
            </div>
          </div>

          {/* CSV Import */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-4 space-y-3">
            <h3 className="font-medium">Bulk Import (CSV)</h3>
            <p className="text-xs text-zinc-500">One per line: name, phone, email</p>
            <textarea className={`${inputCls} h-24`} value={csvText} onChange={e => setCsvText(e.target.value)} placeholder="John Smith, 555-1234, john@email.com&#10;Jane Doe, 555-5678, jane@email.com" />
            <button onClick={importCSV} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm">Import CSV</button>
          </div>

          {/* Guest list */}
          {guests.length > 0 && (
            <div className="bg-[#111] border border-[#262626] rounded-xl overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#1a1a1a] sticky top-0"><tr>
                    <th className="text-left p-3">Name</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Category</th><th className="p-3"></th>
                  </tr></thead>
                  <tbody>
                    {guests.map((g, i) => (
                      <tr key={i} className="border-t border-[#262626]">
                        <td className="p-3">{g.name}</td>
                        <td className="p-3 text-zinc-400">{g.phone || '—'}</td>
                        <td className="p-3 capitalize">{g.category}</td>
                        <td className="p-3"><button onClick={() => setGuests(gs => gs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg">← Back</button>
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold disabled:opacity-50">
              {submitting ? 'Creating...' : '🚀 Launch Grand Opening'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
