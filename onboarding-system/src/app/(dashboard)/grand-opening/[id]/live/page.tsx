'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Event { id: number; agent_name: string; event_title: string; event_date: string; event_time: string; event_timezone: string; zoom_link: string; agent_story: string; trainer_name: string; }

export default function LivePage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    fetch(`/api/grand-opening/events/${id}`).then(r => r.json()).then(setEvent);
  }, [id]);

  useEffect(() => {
    if (!event) return;
    const interval = setInterval(() => {
      const eventDate = new Date(`${event.event_date}T${event.event_time}:00`);
      const diff = eventDate.getTime() - Date.now();
      if (diff <= 0) { setCountdown("IT'S GO TIME! 🚀"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event) return <div className="flex items-center justify-center h-64"><div className="animate-spin text-4xl">🔴</div></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href={`/grand-opening/${id}`} className="text-zinc-400 hover:text-white text-sm">← Back to Event</Link>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">🔴 {event.agent_name}&apos;s {event.event_title}</h1>
        <div className="text-5xl font-bold text-indigo-400 font-mono">{countdown}</div>
      </div>

      {event.zoom_link && (
        <a href={event.zoom_link} target="_blank" rel="noopener noreferrer"
          className="block w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl text-center text-2xl font-bold transition-all shadow-lg">
          🎥 Join Zoom Meeting
        </a>
      )}

      <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">📋 Agenda</h2>
        <div className="space-y-3">
          {[
            { time: '5 min', label: 'Welcome & Introductions', icon: '👋' },
            { time: '20 min', label: 'Presentation', icon: '📊' },
            { time: '5 min', label: 'Q&A', icon: '❓' },
          ].map(a => (
            <div key={a.label} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg">
              <span className="text-xl">{a.icon}</span>
              <div><div className="font-medium">{a.label}</div><div className="text-xs text-zinc-400">{a.time}</div></div>
            </div>
          ))}
        </div>
      </div>

      {event.agent_story && (
        <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">💬 Your Story</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">{event.agent_story}</p>
        </div>
      )}

      <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-xl p-4 text-center">
        <p className="text-yellow-400 font-medium">📹 Reminder: Turn cameras ON — your broker is tracking attendance for your agent&apos;s promotion</p>
      </div>
    </div>
  );
}
