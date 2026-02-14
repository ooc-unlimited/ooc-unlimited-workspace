'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Event { id: number; agent_name: string; event_title: string; event_date: string; event_time: string; event_timezone: string; }

export default function PublicRSVP() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/grand-opening/events/${id}`).then(r => r.json()).then(setEvent);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError('Please enter your name'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/grand-opening/events/${id}/rsvp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to register');
      router.push(`/grand-opening/${id}/invite/success?name=${encodeURIComponent(form.name)}&date=${encodeURIComponent(event?.event_date || '')}&time=${encodeURIComponent(event?.event_time || '')}&tz=${encodeURIComponent(event?.event_timezone || '')}&agent=${encodeURIComponent(event?.agent_name || '')}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a1a]">
      <div className="animate-pulse text-4xl">🎉</div>
    </div>
  );

  const tzLabels: Record<string, string> = { 'America/New_York': 'ET', 'America/Chicago': 'CT', 'America/Denver': 'MT', 'America/Los_Angeles': 'PT' };
  const tz = tzLabels[event.event_timezone] || event.event_timezone;
  const dateStr = new Date(event.event_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center text-3xl mb-4">
              {event.agent_name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold">{event.agent_name}&apos;s</h1>
            <h2 className="text-xl font-semibold mt-1">{event.event_title}</h2>
          </div>

          {/* Event Info */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-2xl">📅</span>
              <div>
                <div className="font-medium">{dateStr}</div>
                <div className="text-zinc-400">{event.event_time} {tz}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-2xl">💻</span>
              <div>
                <div className="font-medium">Virtual Event via Zoom</div>
                <div className="text-zinc-400">Link provided after registration</div>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Join {event.agent_name} for an exclusive look at a financial services opportunity that&apos;s changing lives. Your support means the world!
            </p>

            <hr className="border-[#262626]" />

            {/* RSVP Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input type="text" placeholder="Your Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl focus:border-indigo-500 focus:outline-none" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-lg">
                {submitting ? 'Registering...' : '🤝 Can I Count on You?'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">Powered by GFI Life Index</p>
      </div>
    </div>
  );
}
