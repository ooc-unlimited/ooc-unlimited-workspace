'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { STAGES } from '@/lib/stages';
import { SMS_TEMPLATES } from '@/lib/sms-templates';

interface AgentDetail {
  id: string; name: string; phone: string; email: string; licensed: number;
  current_stage: number; ica_date: string; created_at: string;
  history: Array<{ stage: number; entered_at: string; exited_at: string | null }>;
  notes: Array<{ id: number; content: string; created_at: string }>;
  engagement: Array<{ id: number; type: string; completed: number; due_date: string }>;
  activity: Array<{ id: number; action: string; details: string; created_at: string }>;
}

export default function AgentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [noteText, setNoteText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '' });

  const load = () => fetch(`/api/agents/${id}`).then(r => r.json()).then(setAgent);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [id]);

  if (!agent) return <div className="text-zinc-500">Loading...</div>;

  const stage = STAGES.find(s => s.id === agent.current_stage);
  const nextStage = STAGES.find(s => s.id === agent.current_stage + 1);
  const prevStage = STAGES.find(s => s.id === agent.current_stage - 1);
  const applicableTemplates = SMS_TEMPLATES.filter(t => !t.stage || t.stage === agent.current_stage || t.stage === agent.current_stage - 1);

  const advance = async () => {
    if (!nextStage) return;
    if (!confirm(`Advance ${agent.name} to "${nextStage.name}"?`)) return;
    await fetch(`/api/agents/${id}/advance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    load();
  };

  const regress = async () => {
    if (!prevStage) return;
    if (!confirm(`Move ${agent.name} BACK to "${prevStage.name}"?`)) return;
    await fetch(`/api/agents/${id}/advance`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: prevStage.id }),
    });
    load();
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    await fetch(`/api/agents/${id}/notes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteText }),
    });
    setNoteText('');
    load();
  };

  const saveEdit = async () => {
    await fetch(`/api/agents/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditing(false);
    load();
  };

  const deleteAgent = async () => {
    if (!confirm(`Delete ${agent.name}? This cannot be undone.`)) return;
    await fetch(`/api/agents/${id}`, { method: 'DELETE' });
    router.push('/agents');
  };

  const daysSinceICA = Math.floor((Date.now() - new Date(agent.ica_date).getTime()) / (1000 * 60 * 60 * 24));
  const homeworkDone = agent.engagement.find(e => e.type === 'homework')?.completed === 1;
  const schoolDone = agent.engagement.find(e => e.type === 'onboarding_school')?.completed === 1;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => router.push('/agents')} className="text-zinc-500 text-sm hover:text-white mb-2 block">← Back to Agents</button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {agent.name}
            <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: stage?.color + '20', color: stage?.color }}>
              {stage?.name}
            </span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {agent.phone && <span className="mr-4">📱 {agent.phone}</span>}
            {agent.email && <span className="mr-4">📧 {agent.email}</span>}
            <span>{agent.licensed ? '✅ Licensed' : '📋 Not Licensed'}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setEditForm({ name: agent.name, phone: agent.phone || '', email: agent.email || '' }); setEditing(true); }}
            className="px-3 py-1.5 text-sm bg-[#1a1a1a] border border-[#262626] rounded-lg text-zinc-400 hover:text-white">Edit</button>
          <button onClick={deleteAgent} className="px-3 py-1.5 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300">Delete</button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setEditing(false)}>
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Edit Agent</h2>
            <div className="space-y-3">
              <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Name" />
              <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Phone" />
              <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Email" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveEdit} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium">Save</button>
              <button onClick={() => setEditing(false)} className="flex-1 bg-[#1a1a1a] text-zinc-400 rounded-lg py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stage Progress */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Pipeline Progress</h2>
              <div className="flex gap-2">
                {prevStage && (
                  <button onClick={regress} className="bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-zinc-400 px-3 py-1.5 rounded-lg text-sm">
                    ← {prevStage.short}
                  </button>
                )}
                {nextStage && (
                  <button onClick={advance} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
                    Advance → {nextStage.short}
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {STAGES.map(s => (
                <div key={s.id} className="flex-1">
                  <div
                    className="h-2 rounded-full transition-colors"
                    style={{ backgroundColor: s.id <= agent.current_stage ? s.color : '#262626' }}
                  />
                  <p className="text-[10px] text-zinc-600 mt-1 text-center">{s.short}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Engagement */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <h2 className="font-semibold mb-3">7-Day Engagement Filter <span className="text-zinc-500 text-sm">({daysSinceICA} days since ICA)</span></h2>
            <div className="grid grid-cols-2 gap-4">
              <EngagementCard label="Homework (Building an Empire)" done={homeworkDone}
                onToggle={async () => {
                  await fetch(`/api/agents/${id}/engagement`, {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'homework' }),
                  });
                  load();
                }}
              />
              <EngagementCard label="Onboarding School Attended" done={schoolDone}
                onToggle={async () => {
                  await fetch(`/api/agents/${id}/engagement`, {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'onboarding_school' }),
                  });
                  load();
                }}
              />
            </div>
            {daysSinceICA >= 7 && !homeworkDone && !schoolDone && (
              <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-400">
                ⚠️ 7+ days since ICA with no engagement — consider deprioritizing
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <h2 className="font-semibold mb-4">Timeline</h2>
            <div className="space-y-4">
              {agent.activity.map(a => (
                <div key={a.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm"><span className="font-medium">{a.action}</span></p>
                    {a.details && <p className="text-xs text-zinc-500">{a.details}</p>}
                    <p className="text-xs text-zinc-600">{new Date(a.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {agent.activity.length === 0 && <p className="text-zinc-500 text-sm">No activity yet.</p>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 space-y-3">
            <h2 className="font-semibold">Details</h2>
            <div className="text-sm space-y-2">
              <p><span className="text-zinc-500">ICA Date:</span> {new Date(agent.ica_date).toLocaleDateString()}</p>
              <p><span className="text-zinc-500">Days in Pipeline:</span> {daysSinceICA}</p>
              <p><span className="text-zinc-500">Licensed:</span> {agent.licensed ? 'Yes' : 'No'}</p>
              <p><span className="text-zinc-500">Current Stage:</span> {stage?.name}</p>
            </div>
          </div>

          {/* SMS Templates for Current Stage */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <h2 className="font-semibold mb-3">SMS Actions</h2>
            <div className="space-y-2">
              {applicableTemplates.map(t => (
                <div key={t.id} className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-3">
                  <p className="text-xs font-medium text-indigo-400 mb-1">{t.name}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2">{t.content.replace('{name}', agent.name.split(' ')[0])}</p>
                  <button className="mt-2 text-xs bg-[#262626] hover:bg-[#333] text-zinc-300 px-3 py-1 rounded-md">
                    📱 Send via Ringy (Phase 2)
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <h2 className="font-semibold mb-3">Notes</h2>
            <div className="flex gap-2 mb-3">
              <input
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()}
                placeholder="Add a note..."
                className="flex-1 bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button onClick={addNote} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm">Add</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-auto">
              {agent.notes.map(n => (
                <div key={n.id} className="bg-[#1a1a1a] rounded-lg p-3">
                  <p className="text-sm">{n.content}</p>
                  <p className="text-xs text-zinc-600 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngagementCard({ label, done, onToggle }: { label: string; done: boolean; onToggle: () => void }) {
  return (
    <div className={`border rounded-lg p-3 cursor-pointer transition-colors ${done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#1a1a1a] border-[#262626] hover:border-[#404040]'}`}
      onClick={onToggle}>
      <p className="text-sm">{done ? '✅' : '⬜'} {label}</p>
    </div>
  );
}
