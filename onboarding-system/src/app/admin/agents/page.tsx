'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { STAGES } from '@/lib/stages';

interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  current_stage: number;
  ica_date: string;
  is_stalled: number;
  last_stage_change: string;
}

export default function AgentsPageWrapper() {
  return <Suspense fallback={<div className="text-zinc-500">Loading...</div>}><AgentsPage /></Suspense>;
}

function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [filter, setFilter] = useState(0); // 0 = all
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('add') === 'true') setShowAdd(true);
    loadAgents();
  }, [searchParams]);

  const loadAgents = () => fetch('/api/agents').then(r => r.json()).then(setAgents);

  const addAgent = async () => {
    if (!form.name.trim()) return;
    await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', phone: '', email: '' });
    setShowAdd(false);
    loadAgents();
  };

  const filtered = agents
    .filter(a => filter === 0 || a.current_stage === filter)
    .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || (a.phone && a.phone.includes(search)) || (a.email && a.email.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agents</h1>
        <button onClick={() => setShowAdd(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + New Agent
        </button>
      </div>

      {/* Add Agent Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add New Agent</h2>
            <div className="space-y-3">
              <input
                placeholder="Full Name *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addAgent} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium">
                Add Agent
              </button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-[#1a1a1a] hover:bg-[#262626] text-zinc-400 rounded-lg py-2 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <input
        placeholder="Search agents by name, phone, or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-[#111111] border border-[#262626] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-zinc-600"
      />

      {/* Stage Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter(0)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 0 ? 'bg-indigo-600 text-white' : 'bg-[#1a1a1a] text-zinc-400 hover:text-white'}`}
        >
          All ({agents.length})
        </button>
        {STAGES.map(s => {
          const count = agents.filter(a => a.current_stage === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s.id ? 'text-white' : 'bg-[#1a1a1a] text-zinc-400 hover:text-white'}`}
              style={filter === s.id ? { backgroundColor: s.color } : {}}
            >
              {s.short} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Agent List */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl divide-y divide-[#262626]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            {agents.length === 0 ? 'No agents yet. Add your first recruit!' : 'No agents in this stage.'}
          </div>
        ) : (
          filtered.map(a => {
            const stage = STAGES.find(s => s.id === a.current_stage);
            return (
              <Link
                key={a.id}
                href={`/agents/${a.id}`}
                className="block px-5 py-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-sm font-bold" style={{ color: stage?.color }}>
                      {a.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-white flex items-center gap-2">
                        {a.name}
                        {a.is_stalled === 1 && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Stalled</span>}
                      </p>
                      <p className="text-xs text-zinc-500">{a.phone || a.email || 'No contact info'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: stage?.color + '20', color: stage?.color }}>
                      {stage?.name}
                    </span>
                    <p className="text-xs text-zinc-600 mt-1">
                      ICA: {new Date(a.ica_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
