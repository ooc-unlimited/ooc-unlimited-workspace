import { Stage, AgentStatus } from "./types";

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getStageProgress(stage: Stage): number {
  const map: Record<Stage, number> = {
    "hour-0-12": 10,
    "hour-12-24": 25,
    "hour-24-48": 45,
    "hour-48-72": 65,
    "week-1": 80,
    activated: 100,
  };
  return map[stage];
}

export function getStatusColor(status: AgentStatus): string {
  const map: Record<AgentStatus, string> = {
    "on-track": "text-emerald-400",
    "needs-attention": "text-amber-400",
    "no-engagement": "text-red-400",
  };
  return map[status];
}

export function getStatusBg(status: AgentStatus): string {
  const map: Record<AgentStatus, string> = {
    "on-track": "bg-emerald-500/10 border-emerald-500/20",
    "needs-attention": "bg-amber-500/10 border-amber-500/20",
    "no-engagement": "bg-red-500/10 border-red-500/20",
  };
  return map[status];
}

export function getStatusDot(status: AgentStatus): string {
  const map: Record<AgentStatus, string> = {
    "on-track": "bg-emerald-400",
    "needs-attention": "bg-amber-400",
    "no-engagement": "bg-red-400",
  };
  return map[status];
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
