'use client';

import { useEffect, useState } from 'react';

interface Task { name: string; date: string; goal: string; status: string }
interface Tasks { queued: Task[]; inProgress: Task[]; done: Task[] }
interface Health { label: string; ok: boolean }
interface Agent { name: string; lastActive: string; status: string; hoursAgo: number }

const QUICK_LINKS = [
  { label: 'GoHighLevel', url: 'https://app.gohighlevel.com', icon: '🚀' },
  { label: 'Ringy', url: 'https://app.ringy.com/home/sms', icon: '📞' },
  { label: 'PropHog', url: 'https://agent-recruiting.prophog.ai/leads', icon: '🐷' },
  { label: 'Tevah', url: 'https://tevahtech.com/', icon: '📊' },
  { label: 'iDecide', url: 'https://login.idecide.com/members/#contacts', icon: '🎯' },
  { label: 'Discord', url: 'https://discord.com/channels/1471377225021526071', icon: '💬' },
];

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-[#1a1a2e] border border-[#262640] rounded-lg p-3 mb-2">
      <p className="text-sm text-white font-medium">{task.name}</p>
      <div className="flex gap-2 mt-1.5">
        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">{task.goal}</span>
        <span className="text-xs text-zinc-500">{task.date}</span>
      </div>
    </div>
  );
}

export default function MissionControl() {
  const [tasks, setTasks] = useState<Tasks>({ queued: [], inProgress: [], done: [] });
  const [health, setHealth] = useState<Health[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  const fetchAll = () => {
    fetch('/api/mission-control/tasks').then(r => r.json()).then(setTasks).catch(() => {});
    fetch('/api/mission-control/health').then(r => r.json()).then(setHealth).catch(() => {});
    fetch('/api/mission-control/agents').then(r => r.json()).then(setAgents).catch(() => {});
  };

  useEffect(() => {
    fetchAll();
    const i = setInterval(fetchAll, 60000);
    return () => clearInterval(i);
  }, []);

  const days556k = daysUntil('2026-05-23');
  const daysEMD = daysUntil('2026-06-30');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🎛️ Mission Control</h1>
        <span className="text-xs text-zinc-500">Auto-refreshes every 60s</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111122] border border-[#262640] rounded-xl p-5">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">$556K Target</p>
          <p className="text-3xl font-bold text-white mt-1">{days556k}</p>
          <p className="text-xs text-zinc-500 mt-1">days until May 23, 2026</p>
        </div>
        <div className="bg-[#111122] border border-[#262640] rounded-xl p-5">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">EMD Promotion</p>
          <p className="text-3xl font-bold text-white mt-1">{daysEMD}</p>
          <p className="text-xs text-zinc-500 mt-1">days until June 30, 2026</p>
        </div>
        <div className="bg-[#111122] border border-[#262640] rounded-xl p-5">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">Tasks Completed</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">{tasks.done.length}</p>
          <p className="text-xs text-zinc-500 mt-1">of {tasks.queued.length + tasks.inProgress.length + tasks.done.length} total</p>
        </div>
        <div className="bg-[#111122] border border-[#262640] rounded-xl p-5">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">Site Health</p>
          <p className="text-3xl font-bold mt-1">{health.every(h => h.ok) ? '🟢' : '🔴'}</p>
          <p className="text-xs text-zinc-500 mt-1">{health.filter(h => h.ok).length}/{health.length} services up</p>
        </div>
      </div>

      {/* Kanban */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">🎯 Autonomous Task Kanban</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Queued', items: tasks.queued, color: 'text-zinc-400' },
            { title: 'In Progress', items: tasks.inProgress, color: 'text-yellow-400' },
            { title: 'Done', items: tasks.done, color: 'text-emerald-400' },
          ].map(col => (
            <div key={col.title} className="bg-[#0d0d1a] border border-[#262640] rounded-xl p-4">
              <h3 className={`text-sm font-semibold ${col.color} mb-3`}>
                {col.title} ({col.items.length})
              </h3>
              {col.items.map((t, i) => <TaskCard key={i} task={t} />)}
              {col.items.length === 0 && <p className="text-xs text-zinc-600">No tasks</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Agent Status + Site Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111122] border border-[#262640] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-3">👥 Agent Team Status</h2>
          <div className="space-y-2">
            {agents.map(a => (
              <div key={a.name} className="flex items-center justify-between py-1.5 border-b border-[#1a1a2e] last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    a.status === 'green' ? 'bg-emerald-400' : a.status === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-sm text-white">{a.name}</span>
                </div>
                <span className="text-xs text-zinc-500">
                  {a.hoursAgo < 1 ? 'Just now' : `${a.hoursAgo}h ago`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#111122] border border-[#262640] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-3">🌐 Site Health</h2>
            <div className="space-y-2">
              {health.map(h => (
                <div key={h.label} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-zinc-300">{h.label}</span>
                  <span className={`text-sm font-medium ${h.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                    {h.ok ? '● Online' : '● Down'}
                  </span>
                </div>
              ))}
              {health.length === 0 && <p className="text-xs text-zinc-600">Loading...</p>}
            </div>
          </div>

          <div className="bg-[#111122] border border-[#262640] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-3">📋 Quick Links</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_LINKS.map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] hover:bg-[#252540] border border-[#262640] rounded-lg text-sm text-zinc-300 hover:text-white transition-colors">
                  <span>{l.icon}</span><span>{l.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
