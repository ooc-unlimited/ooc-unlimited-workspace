'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChartBarIcon, UserGroupIcon, BanknotesIcon, ArrowTrendingUpIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface DashboardMetrics {
  // Recruiting Metrics
  pipeline: {
    stageCounts: Array<{ stage: number; name: string; short: string; color: string; count: number }>;
    total: number;
    stalled: number;
    thisWeek: number;
    thisMonth: number;
    producing: number;
  };
  
  // Business Metrics (will be connected to external sources)
  business: {
    policies: {
      thisMonth: number;
      lastMonth: number;
      ytd: number;
      avgValue: number;
    };
    revenue: {
      thisMonth: number;
      lastMonth: number;
      ytd: number;
      target: number;
    };
    team: {
      totalAgents: number;
      activeAgents: number;
      topPerformers: Array<{ name: string; policies: number; revenue: number }>;
    };
  };
  
  recentActivity: Array<{ id: number; agent_name: string; action: string; details: string; created_at: string }>;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      // Fallback to basic pipeline data
      const pipelineResponse = await fetch('/api/metrics');
      const pipelineData = await pipelineResponse.json();
      setMetrics({
        pipeline: {
          stageCounts: pipelineData.stageCounts,
          total: pipelineData.total,
          stalled: pipelineData.stalled,
          thisWeek: pipelineData.thisWeek,
          thisMonth: pipelineData.thisMonth,
          producing: pipelineData.producing,
        },
        business: {
          policies: { thisMonth: 0, lastMonth: 0, ytd: 0, avgValue: 0 },
          revenue: { thisMonth: 0, lastMonth: 0, ytd: 0, target: 556000 },
          team: { totalAgents: pipelineData.total, activeAgents: pipelineData.producing, topPerformers: [] },
        },
        recentActivity: pipelineData.recentActivity,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Failed to load dashboard metrics.
      </div>
    );
  }

  const { pipeline, business, recentActivity } = metrics;

  // Calculate growth percentages
  const policyGrowth = business.policies.lastMonth > 0 
    ? Math.round(((business.policies.thisMonth - business.policies.lastMonth) / business.policies.lastMonth) * 100)
    : business.policies.thisMonth > 0 ? 100 : 0;
    
  const revenueGrowth = business.revenue.lastMonth > 0
    ? Math.round(((business.revenue.thisMonth - business.revenue.lastMonth) / business.revenue.lastMonth) * 100)
    : business.revenue.thisMonth > 0 ? 100 : 0;

  const targetProgress = Math.round((business.revenue.ytd / business.revenue.target) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-zinc-500 mt-1">Business Overview & Performance Metrics</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/agents?add=true"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Agent
          </Link>
          <Link
            href="/admin/dashboard"
            className="border border-zinc-700 hover:border-zinc-600 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Pipeline View
          </Link>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500 uppercase tracking-wider">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${business.revenue.thisMonth.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${revenueGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className={`text-sm ${revenueGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}% vs last month
                </span>
              </div>
            </div>
            <BanknotesIcon className="w-10 h-10 text-emerald-400/30" />
          </div>
        </div>

        {/* Policies Card */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500 uppercase tracking-wider">Policies This Month</p>
              <p className="text-2xl font-bold text-white mt-1">
                {business.policies.thisMonth}
              </p>
              <div className="flex items-center mt-2">
                <ShieldCheckIcon className={`w-4 h-4 mr-1 ${policyGrowth >= 0 ? 'text-blue-400' : 'text-red-400'}`} />
                <span className={`text-sm ${policyGrowth >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {policyGrowth >= 0 ? '+' : ''}{policyGrowth}% vs last month
                </span>
              </div>
            </div>
            <ShieldCheckIcon className="w-10 h-10 text-blue-400/30" />
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500 uppercase tracking-wider">Active Agents</p>
              <p className="text-2xl font-bold text-white mt-1">
                {business.team.activeAgents} / {business.team.totalAgents}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-purple-400">
                  {business.team.totalAgents > 0 ? Math.round((business.team.activeAgents / business.team.totalAgents) * 100) : 0}% producing
                </span>
              </div>
            </div>
            <UserGroupIcon className="w-10 h-10 text-purple-400/30" />
          </div>
        </div>

        {/* Annual Target Progress */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500 uppercase tracking-wider">YTD Progress</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${business.revenue.ytd.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <div className="flex-1">
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(targetProgress, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-indigo-400 mt-1">
                    {targetProgress}% of $556K target
                  </span>
                </div>
              </div>
            </div>
            <ChartBarIcon className="w-10 h-10 text-indigo-400/30" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-indigo-400" />
            Recruiting Pipeline
          </h2>
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{pipeline.total}</p>
                <p className="text-sm text-zinc-500">Total Agents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-400">{pipeline.thisWeek}</p>
                <p className="text-sm text-zinc-500">This Week</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${pipeline.stalled > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                  {pipeline.stalled}
                </p>
                <p className="text-sm text-zinc-500">Stalled</p>
              </div>
            </div>

            {/* Stage Progress */}
            <div className="space-y-3">
              {pipeline.stageCounts.map((s) => {
                const maxCount = Math.max(...pipeline.stageCounts.map(x => x.count), 1);
                const width = Math.max((s.count / maxCount) * 100, 4);
                return (
                  <div key={s.stage} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-zinc-400 text-right shrink-0">{s.short}</div>
                    <div className="flex-1 bg-[#1a1a1a] rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center px-2 text-xs font-medium text-white transition-all duration-500"
                        style={{ width: `${width}%`, backgroundColor: s.color }}
                      >
                        {s.count > 0 && s.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/admin/dashboard"
              className="block text-center text-sm text-indigo-400 hover:text-indigo-300 mt-4 transition-colors"
            >
              View Detailed Pipeline →
            </Link>
          </div>
        </div>

        {/* Recent Activity & Top Performers */}
        <div className="space-y-6">
          {/* Top Performers */}
          {business.team.topPerformers.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
              <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
                <div className="space-y-3">
                  {business.team.topPerformers.map((performer, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {i + 1}
                        </div>
                        <span className="font-medium">{performer.name}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-white font-medium">{performer.policies} policies</div>
                        <div className="text-zinc-500">${performer.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-[#111111] border border-[#262626] rounded-xl divide-y divide-[#262626]">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">
                  No activity yet. Add your first agent to get started.
                </div>
              ) : (
                recentActivity.slice(0, 8).map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-white">{a.agent_name}</span>
                      <span className="text-zinc-500 text-sm ml-2">— {a.action}</span>
                      {a.details && <p className="text-xs text-zinc-600 mt-0.5 truncate max-w-md">{a.details}</p>}
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
              {recentActivity.length > 8 && (
                <div className="px-5 py-3 text-center">
                  <Link href="/admin/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    View All Activity →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Link
          href="/admin/agents"
          className="bg-[#111111] border border-[#262626] rounded-xl p-4 hover:border-[#404040] transition-colors group"
        >
          <UserGroupIcon className="w-8 h-8 text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" />
          <p className="font-medium">Manage Agents</p>
          <p className="text-sm text-zinc-500">View and manage all agents</p>
        </Link>

        <Link
          href="/admin/grand-opening"
          className="bg-[#111111] border border-[#262626] rounded-xl p-4 hover:border-[#404040] transition-colors group"
        >
          <div className="w-8 h-8 text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors text-2xl">🎉</div>
          <p className="font-medium">Grand Opening Factory</p>
          <p className="text-sm text-zinc-500">Create and manage events</p>
        </Link>

        <Link
          href="/admin/scorecard"
          className="bg-[#111111] border border-[#262626] rounded-xl p-4 hover:border-[#404040] transition-colors group"
        >
          <ChartBarIcon className="w-8 h-8 text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors" />
          <p className="font-medium">Weekly Scorecard</p>
          <p className="text-sm text-zinc-500">Track key metrics</p>
        </Link>

        <Link
          href="/admin/mission-control"
          className="bg-[#111111] border border-[#262626] rounded-xl p-4 hover:border-[#404040] transition-colors group"
        >
          <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400 mb-2 group-hover:text-purple-300 transition-colors" />
          <p className="font-medium">Mission Control</p>
          <p className="text-sm text-zinc-500">Goal-driven tasks</p>
        </Link>

        <Link
          href="/admin/training"
          className="bg-[#111111] border border-[#262626] rounded-xl p-4 hover:border-[#404040] transition-colors group"
        >
          <ShieldCheckIcon className="w-8 h-8 text-blue-400 mb-2 group-hover:text-blue-300 transition-colors" />
          <p className="font-medium">Training Matrix</p>
          <p className="text-sm text-zinc-500">Agent development</p>
        </Link>
      </div>
    </div>
  );
}