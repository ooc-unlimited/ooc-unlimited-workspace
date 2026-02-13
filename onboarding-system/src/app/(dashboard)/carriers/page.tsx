'use client';

import { useState } from 'react';
import { TOP_PRODUCTS, PRODUCT_TYPES } from '@/lib/carriers';

export default function CarriersPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'payout' | 'provider'>('payout');
  const [search, setSearch] = useState('');

  const filtered = TOP_PRODUCTS
    .filter(p => filterType === 'all' || p.type === filterType)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return p.provider.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.highlight?.toLowerCase().includes(q);
    })
    .sort((a, b) => sortBy === 'payout' ? b.payout - a.payout : a.provider.localeCompare(b.provider));

  const getTypeColor = (type: string) => PRODUCT_TYPES.find(t => t.id === type)?.color ?? '#666';
  const getTypeLabel = (type: string) => PRODUCT_TYPES.find(t => t.id === type)?.label ?? type;

  const payoutColor = (payout: number) => {
    if (payout === 100) return 'text-emerald-400';
    if (payout >= 90) return 'text-green-400';
    if (payout >= 80) return 'text-yellow-400';
    if (payout >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  // Stats
  const hundredPercent = TOP_PRODUCTS.filter(p => p.payout === 100).length;
  const carriers = new Set(TOP_PRODUCTS.map(p => p.provider)).size;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🏢 Carrier Product Guide</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Quick reference for Austin&apos;s Sales Department — sorted by agent payout
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Products</p>
          <p className="text-3xl font-bold text-white mt-1">{TOP_PRODUCTS.length}</p>
        </div>
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">100% Payout</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">{hundredPercent}</p>
        </div>
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Carriers</p>
          <p className="text-3xl font-bold text-indigo-400 mt-1">{carriers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#111111] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 w-60"
        />
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'all' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          {PRODUCT_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === t.id ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
              style={filterType === t.id ? { backgroundColor: t.color } : { backgroundColor: '#1a1a1a' }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortBy(s => s === 'payout' ? 'provider' : 'payout')}
          className="ml-auto bg-[#1a1a1a] border border-[#262626] text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          Sort: {sortBy === 'payout' ? '💰 Payout' : '🏢 Provider'}
        </button>
      </div>

      {/* Product Cards */}
      <div className="space-y-3">
        {filtered.map((p, i) => (
          <div key={i} className="bg-[#111111] border border-[#262626] rounded-xl p-5 card-hover">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-white">{p.provider}</h3>
                  <span className="text-zinc-400 text-sm">{p.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: getTypeColor(p.type) + '20', color: getTypeColor(p.type) }}
                  >
                    {getTypeLabel(p.type)}
                  </span>
                </div>
                {p.highlight && (
                  <p className="text-sm text-zinc-500 mt-2">{p.highlight}</p>
                )}
                <div className="flex gap-4 mt-2 text-xs text-zinc-600">
                  {p.issueAges && <span>Ages: {p.issueAges}</span>}
                  {p.minFace && <span>Min: {p.minFace}</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-2xl font-bold ${payoutColor(p.payout)}`}>{p.payout}%</p>
                <p className="text-xs text-zinc-600">payout</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-zinc-500 py-12">
          No products match your filters.
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 text-sm text-zinc-500">
        <p><strong className="text-zinc-400">⚠️ Note:</strong> Gary cannot use North American products (credit issue — DC working on it). Payouts based on GFI compensation grid. Always verify current rates with carrier before quoting.</p>
        <p className="mt-2"><strong className="text-zinc-400">Priority:</strong> Recommend 100% payout products first when they fit the client&apos;s needs. F&G Pathsetter (IUL), Ameritas (WL), Ethos/SBLI (Term) are the go-to carriers.</p>
      </div>
    </div>
  );
}
