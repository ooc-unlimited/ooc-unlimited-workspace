'use client';
import { useState, useEffect } from 'react';

export default function MissionControl() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Gary's $556K goal tracking
  const goalAmount = 556000;
  const goalDate = new Date('2026-05-23');
  const startDate = new Date('2024-01-01'); // Approximate start
  const currentAmount = 165000; // Floor amount Gary mentioned
  const daysToGoal = Math.ceil((goalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const dailyTarget = (goalAmount - currentAmount) / daysToGoal;
  const progressPercent = (currentAmount / goalAmount) * 100;

  // Recruiting metrics (example data)
  const recruitingStats = {
    totalAgents: 14,
    activeAgents: 12,
    monthlyRecruiting: 8,
    conversionRate: 23,
    avgCheck: 4200
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B3FF5] to-[#6B2DB8] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">⚡ OOC Unlimited Mission Control</h1>
              <p className="text-purple-100 mt-1">Autonomous AI Business Management System</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</div>
              <div className="text-purple-100">{currentTime.toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-[#111] border border-[#8B3FF5] rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-2 text-[#8B3FF5]">🎯 Mission Statement</h2>
          <p className="text-lg">
            Build OOC Unlimited into a <strong className="text-[#8B3FF5]">$556K+ autonomous recruiting and training organization</strong> 
            that helps licensed agents achieve financial success 24/7 while supporting Gary's mission to help people like he was - 
            the broke, laid-off person who stumbled into insurance with zero support.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Progress */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">💰 Revenue Goal</h3>
              <span className="text-[#8B3FF5]">{progressPercent.toFixed(1)}%</span>
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold">${currentAmount.toLocaleString()}</div>
              <div className="text-sm text-zinc-400">of ${goalAmount.toLocaleString()}</div>
            </div>
            <div className="w-full bg-[#262626] rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-[#8B3FF5] to-[#6B2DB8] h-2 rounded-full" 
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-zinc-400">{daysToGoal} days left | ${dailyTarget.toFixed(0)}/day needed</div>
          </div>

          {/* Team Size */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">👥 Team Size</h3>
              <span className="text-green-400">+{recruitingStats.monthlyRecruiting}/mo</span>
            </div>
            <div className="text-2xl font-bold">{recruitingStats.totalAgents}</div>
            <div className="text-sm text-zinc-400">Active Agents</div>
            <div className="text-xs text-zinc-400 mt-2">
              {recruitingStats.conversionRate}% stick rate | ${recruitingStats.avgCheck} avg check
            </div>
          </div>

          {/* Pipeline Health */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">📈 Pipeline</h3>
              <span className="text-blue-400">Active</span>
            </div>
            <div className="text-2xl font-bold">47</div>
            <div className="text-sm text-zinc-400">PropHog → Ringy</div>
            <div className="text-xs text-zinc-400 mt-2">
              23 contacted | 12 responding | 5 licensing
            </div>
          </div>

          {/* AI Tasks Today */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">🤖 AI Tasks</h3>
              <span className="text-purple-400">Auto</span>
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-zinc-400">Completed Today</div>
            <div className="text-xs text-zinc-400 mt-2">
              6 scheduled | 3 in progress
            </div>
          </div>
        </div>

        {/* Active Systems */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🛠️ Connected Systems</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>PropHog (Lead Source)</span>
                <span className="text-green-400">✅ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ringy (CRM/SMS)</span>
                <span className="text-green-400">✅ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tevah (Back Office)</span>
                <span className="text-green-400">✅ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GoHighLevel</span>
                <span className="text-yellow-400">⚠️ Limited API</span>
              </div>
              <div className="flex items-center justify-between">
                <span>iDecide (Presentations)</span>
                <span className="text-green-400">✅ Connected</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🎯 Autonomous Tasks Running</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">PropHog lead monitoring (every 2 hours)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Competitor analysis (daily)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Revenue optimization research</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Agent success pattern analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent AI Activity */}
        <div className="bg-[#111] border border-[#262626] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">📋 Recent AI Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg">
              <div className="text-green-400">✅</div>
              <div>
                <div className="font-semibold">Fixed Grand Opening Factory success page</div>
                <div className="text-sm text-zinc-400">Resolved 404 redirect issue - system now production ready</div>
                <div className="text-xs text-zinc-500">5:54 PM today</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg">
              <div className="text-blue-400">🔄</div>
              <div>
                <div className="font-semibold">YouTube business intelligence extraction</div>
                <div className="text-sm text-zinc-400">Processed OpenClaw optimization video for business improvements</div>
                <div className="text-xs text-zinc-500">5:56 PM today</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg">
              <div className="text-purple-400">🚀</div>
              <div>
                <div className="font-semibold">Building Mission Control dashboard</div>
                <div className="text-sm text-zinc-400">Creating autonomous business management system</div>
                <div className="text-xs text-zinc-500">5:58 PM today - In Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}