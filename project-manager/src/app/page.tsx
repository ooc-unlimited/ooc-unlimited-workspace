"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import {
  Status,
  STATUS_ORDER,
  STATUS_LABELS,
  STATUS_COLORS,
  Priority,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from "@/lib/types";

export default function DashboardPage() {
  const { tasks, loaded } = useApp();

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const overdue = tasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "done"
    ).length;

    const byStatus: Record<Status, number> = {
      backlog: 0,
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    };
    const byPriority: Record<Priority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    for (const t of tasks) {
      byStatus[t.status]++;
      byPriority[t.priority]++;
    }

    return { total, done, inProgress, overdue, byStatus, byPriority };
  }, [tasks]);

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
    [tasks]
  );

  const completionPct =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  if (!loaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome to Donna PM — your project overview
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={stats.total} color="text-white" />
          <StatCard label="In Progress" value={stats.inProgress} color="text-purple-400" />
          <StatCard label="Completed" value={stats.done} sub={`${completionPct}%`} color="text-green-400" />
          <StatCard label="Overdue" value={stats.overdue} color="text-red-400" />
        </div>

        {/* Progress bar */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm text-white font-medium">{completionPct}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* By status */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Tasks by Status
            </h3>
            <div className="space-y-2">
              {STATUS_ORDER.map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[s]}`}>
                    {STATUS_LABELS[s]}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-600 rounded-full"
                        style={{
                          width: stats.total
                            ? `${(stats.byStatus[s] / stats.total) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">
                      {stats.byStatus[s]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By priority */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Tasks by Priority
            </h3>
            <div className="space-y-2">
              {(["urgent", "high", "medium", "low"] as Priority[]).map((p) => (
                <div key={p} className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${PRIORITY_COLORS[p]}`}>
                    {PRIORITY_LABELS[p]}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-600 rounded-full"
                        style={{
                          width: stats.total
                            ? `${(stats.byPriority[p] / stats.total) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">
                      {stats.byPriority[p]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent tasks */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-300">
              Recently Updated
            </h3>
            <Link
              href="/tasks"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-gray-600 py-4 text-center">
              No tasks yet. Create one to get started!
            </p>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <Link
                  key={task.id}
                  href="/tasks"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/40 transition-colors"
                >
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[task.status]}`}>
                    {STATUS_LABELS[task.status]}
                  </span>
                  <span className="text-sm text-gray-300 flex-1 truncate">
                    {task.title}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[task.priority]}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-4">
          <QuickLink href="/tasks" label="Task List" desc="View and filter all tasks" />
          <QuickLink href="/board" label="Kanban Board" desc="Drag-and-drop workflow" />
          <QuickLink href="/calendar" label="Calendar" desc="Due dates at a glance" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {sub && <span className="text-xs text-gray-500">{sub}</span>}
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  desc,
}: {
  href: string;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-violet-500/30 hover:bg-gray-900/80 transition-colors group"
    >
      <p className="text-sm font-medium text-gray-200 group-hover:text-violet-400 transition-colors">
        {label}
      </p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </Link>
  );
}
