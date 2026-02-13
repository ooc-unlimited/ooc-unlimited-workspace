export type Stage =
  | "hour-0-12"
  | "hour-12-24"
  | "hour-24-48"
  | "hour-48-72"
  | "week-1"
  | "activated";

export type AgentStatus = "on-track" | "needs-attention" | "no-engagement";

export type SequenceStepKey =
  | "hour-0"
  | "hour-6"
  | "hour-12"
  | "hour-24"
  | "hour-36"
  | "hour-48"
  | "hour-72";

export interface SequenceStep {
  key: SequenceStepKey;
  hour: number;
  label: string;
  messageTemplate: string;
  isAlert?: boolean;
  alertMessage?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string; // ISO date string
  type: "sms-sent" | "sms-received" | "call" | "milestone" | "alert" | "note";
  title: string;
  description: string;
  sequenceStepKey?: SequenceStepKey;
}

export interface Milestone {
  key: string;
  label: string;
  completedAt: string | null;
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  icaDate: string; // ISO date string — when they signed
  stage: Stage;
  status: AgentStatus;
  lastContactAt: string | null;
  lastResponseAt: string | null;
  timeline: TimelineEvent[];
  milestones: Milestone[];
  completedSteps: SequenceStepKey[];
  notes: string;
}

export interface Alert {
  id: string;
  agentId: string;
  agentName: string;
  type: "no-response" | "silent-48h" | "escalation" | "milestone-stalled";
  message: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface DailySummary {
  date: string;
  totalAgents: number;
  onTrack: number;
  needsAttention: number;
  noEngagement: number;
  newSignups: number;
  activated: number;
  alertCount: number;
  agentsNeedingCalls: string[]; // agent IDs
}
