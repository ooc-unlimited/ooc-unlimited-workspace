import {
  Agent,
  Alert,
  DailySummary,
  Stage,
  AgentStatus,
  TimelineEvent,
  Milestone,
  SequenceStepKey,
} from "./types";

const FIRST_NAMES = [
  "Marcus", "Tanya", "DeShawn", "Keisha", "Jerome", "LaShonda", "Brandon",
  "Aaliyah", "Terrence", "Jasmine", "Darius", "Crystal", "Andre", "Monique",
  "Tyrone", "Latisha", "Kevin", "Shaniqua", "Rashad", "Tamika", "Carlos",
  "Priya", "James", "Destiny", "Anthony", "Brianna", "Michael", "Shante",
  "Robert", "Diamond", "Eric", "Amber", "Travis", "Nicole", "Derek",
  "Alicia", "Raymond", "Tonya", "William", "Stacy", "Curtis", "Robin",
  "Patrick", "Melissa", "Larry", "Sandra", "Keith", "Michelle", "Gregory",
  "Denise", "Ronald", "Patricia", "Timothy", "Lisa", "Jason", "Angela",
  "Frank", "Dorothy", "Steven", "Maria", "Chris", "Rosa", "Omar",
  "Fatima", "David", "Sarah", "Jonathan", "Christina", "Mark", "Vanessa",
];

const LAST_NAMES = [
  "Williams", "Johnson", "Smith", "Brown", "Jones", "Davis", "Miller",
  "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White",
  "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
  "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen",
  "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott",
  "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell",
  "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans",
  "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed",
  "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper",
  "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray",
];

const STATES = [
  "TX", "GA", "FL", "NC", "SC", "AL", "LA", "MS", "TN", "VA",
  "MD", "OH", "IL", "CA", "NY", "NJ", "PA", "MI", "IN", "MO",
];

function randomPhone(): string {
  const area = Math.floor(Math.random() * 900) + 100;
  const mid = Math.floor(Math.random() * 900) + 100;
  const end = Math.floor(Math.random() * 9000) + 1000;
  return `(${area}) ${mid}-${end}`;
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

function daysAgo(d: number): string {
  return hoursAgo(d * 24);
}

const DEFAULT_MILESTONES: Milestone[] = [
  { key: "welcome-received", label: "Welcome Message Received", completedAt: null },
  { key: "checklist-opened", label: "Quick-Start Checklist Opened", completedAt: null },
  { key: "checklist-completed", label: "Checklist Completed", completedAt: null },
  { key: "training-watched", label: "Training Video Watched", completedAt: null },
  { key: "micro-task-done", label: "Micro-Task Completed", completedAt: null },
  { key: "first-call-completed", label: "First Call with Gary", completedAt: null },
  { key: "first-prospect-contact", label: "First Prospect Contacted", completedAt: null },
];

function buildTimeline(
  agent: { firstName: string; lastName: string },
  stage: Stage,
  status: AgentStatus,
  icaDate: string
): { timeline: TimelineEvent[]; completedSteps: SequenceStepKey[]; milestones: Milestone[] } {
  const timeline: TimelineEvent[] = [];
  const completedSteps: SequenceStepKey[] = [];
  const milestones = DEFAULT_MILESTONES.map((m) => ({ ...m }));
  const ica = new Date(icaDate).getTime();
  let eventId = 1;

  const addEvent = (
    hoursAfterIca: number,
    type: TimelineEvent["type"],
    title: string,
    description: string,
    stepKey?: SequenceStepKey
  ) => {
    timeline.push({
      id: `evt-${eventId++}`,
      timestamp: new Date(ica + hoursAfterIca * 3600 * 1000).toISOString(),
      type,
      title,
      description,
      sequenceStepKey: stepKey,
    });
  };

  // Everyone gets welcome message
  addEvent(0.1, "sms-sent", "Welcome SMS Sent", `Welcome to GFI, ${agent.firstName}!`, "hour-0");
  completedSteps.push("hour-0");
  milestones[0].completedAt = new Date(ica + 0.1 * 3600 * 1000).toISOString();

  if (status === "no-engagement" && stage === "hour-48-72") {
    addEvent(6, "sms-sent", "Quick-Start Checklist Sent", "Checklist link sent", "hour-6");
    completedSteps.push("hour-6");
    addEvent(12, "sms-sent", "Checklist Follow-Up", "Follow-up sent", "hour-12");
    completedSteps.push("hour-12");
    addEvent(24, "sms-sent", "Training Video Sent", "Training video + micro-task", "hour-24");
    completedSteps.push("hour-24");
    addEvent(36, "sms-sent", "Check-In Sent", "How's everything going?", "hour-36");
    completedSteps.push("hour-36");
    addEvent(48, "alert", "48-Hour Alert Triggered", `No response from ${agent.firstName}. Personal call needed.`, "hour-48");
    completedSteps.push("hour-48");
    return { timeline, completedSteps, milestones };
  }

  if (stage === "hour-0-12") {
    if (status === "on-track") {
      addEvent(0.5, "sms-received", "Agent Replied", `${agent.firstName} responded to welcome message`, "hour-0");
    }
    return { timeline, completedSteps, milestones };
  }

  // Hour 6
  addEvent(6, "sms-sent", "Quick-Start Checklist Sent", "Checklist link delivered", "hour-6");
  completedSteps.push("hour-6");

  if (stage === "hour-12-24") {
    if (status === "on-track") {
      addEvent(7, "sms-received", "Agent Replied", `${agent.firstName} opened checklist`);
      milestones[1].completedAt = new Date(ica + 7 * 3600 * 1000).toISOString();
      addEvent(12, "sms-sent", "Checklist Follow-Up", "Did you look at the checklist?", "hour-12");
      completedSteps.push("hour-12");
    }
    return { timeline, completedSteps, milestones };
  }

  // Hour 12
  addEvent(12, "sms-sent", "Checklist Follow-Up Sent", "Follow-up on checklist", "hour-12");
  completedSteps.push("hour-12");

  if (stage === "hour-24-48") {
    if (status === "on-track") {
      addEvent(13, "sms-received", "Agent Replied", `${agent.firstName}: "Yes! Working on it now"`);
      milestones[1].completedAt = new Date(ica + 13 * 3600 * 1000).toISOString();
      addEvent(24, "sms-sent", "Training Video Sent", "Training video + micro-task assigned", "hour-24");
      completedSteps.push("hour-24");
      addEvent(26, "sms-received", "Agent Replied", `${agent.firstName}: "Great video, wrote my list"`);
      milestones[3].completedAt = new Date(ica + 26 * 3600 * 1000).toISOString();
      milestones[4].completedAt = new Date(ica + 26 * 3600 * 1000).toISOString();
    } else if (status === "needs-attention") {
      addEvent(24, "sms-sent", "Training Video Sent", "Training video + micro-task", "hour-24");
      completedSteps.push("hour-24");
    }
    return { timeline, completedSteps, milestones };
  }

  // Hour 24
  addEvent(24, "sms-sent", "Training Video Sent", "Training video + micro-task", "hour-24");
  completedSteps.push("hour-24");

  // Hour 36
  addEvent(36, "sms-sent", "Check-In Sent", "How's everything going?", "hour-36");
  completedSteps.push("hour-36");

  if (stage === "hour-48-72") {
    if (status === "on-track") {
      addEvent(37, "sms-received", "Agent Replied", `${agent.firstName}: "Going great! Watched the video twice."`);
      milestones[3].completedAt = new Date(ica + 37 * 3600 * 1000).toISOString();
    }
    return { timeline, completedSteps, milestones };
  }

  // Week 1 and Activated
  addEvent(48, "sms-sent", "48-Hour Check-In", "Continued engagement", "hour-48");
  completedSteps.push("hour-48");
  addEvent(72, "sms-sent", "72-Hour Final Check", "End of activation sequence", "hour-72");
  completedSteps.push("hour-72");

  if (stage === "week-1" || stage === "activated") {
    addEvent(50, "call", "Call with Gary", "15-minute onboarding call completed");
    milestones[5].completedAt = new Date(ica + 50 * 3600 * 1000).toISOString();
    milestones[0].completedAt = milestones[0].completedAt || new Date(ica + 0.1 * 3600 * 1000).toISOString();
    milestones[1].completedAt = milestones[1].completedAt || new Date(ica + 8 * 3600 * 1000).toISOString();
    milestones[2].completedAt = milestones[2].completedAt || new Date(ica + 20 * 3600 * 1000).toISOString();
    milestones[3].completedAt = milestones[3].completedAt || new Date(ica + 26 * 3600 * 1000).toISOString();
    milestones[4].completedAt = milestones[4].completedAt || new Date(ica + 30 * 3600 * 1000).toISOString();
  }

  if (stage === "activated") {
    addEvent(96, "milestone", "Agent Activated", `${agent.firstName} contacted their first prospect`);
    milestones[6].completedAt = new Date(ica + 96 * 3600 * 1000).toISOString();
  }

  return { timeline, completedSteps, milestones };
}

function generateAgents(): Agent[] {
  const agents: Agent[] = [];

  // Distribution to match Gary's reality: mostly stalled, some active
  // 70 agents total: ~10 activated, ~8 week-1, ~12 hour-48-72 (mixed), ~15 hour-24-48, ~12 hour-12-24, ~13 hour-0-12
  const distribution: { stage: Stage; status: AgentStatus; hoursAgo: number; count: number }[] = [
    { stage: "hour-0-12", status: "on-track", hoursAgo: 2, count: 5 },
    { stage: "hour-0-12", status: "on-track", hoursAgo: 8, count: 4 },
    { stage: "hour-0-12", status: "needs-attention", hoursAgo: 10, count: 4 },
    { stage: "hour-12-24", status: "on-track", hoursAgo: 16, count: 6 },
    { stage: "hour-12-24", status: "needs-attention", hoursAgo: 20, count: 6 },
    { stage: "hour-24-48", status: "on-track", hoursAgo: 30, count: 5 },
    { stage: "hour-24-48", status: "needs-attention", hoursAgo: 40, count: 5 },
    { stage: "hour-24-48", status: "no-engagement", hoursAgo: 44, count: 5 },
    { stage: "hour-48-72", status: "on-track", hoursAgo: 55, count: 4 },
    { stage: "hour-48-72", status: "needs-attention", hoursAgo: 60, count: 4 },
    { stage: "hour-48-72", status: "no-engagement", hoursAgo: 68, count: 4 },
    { stage: "week-1", status: "on-track", hoursAgo: 120, count: 4 },
    { stage: "week-1", status: "needs-attention", hoursAgo: 144, count: 4 },
    { stage: "activated", status: "on-track", hoursAgo: 200, count: 10 },
  ];

  let idx = 0;
  for (const group of distribution) {
    for (let i = 0; i < group.count; i++) {
      const firstName = FIRST_NAMES[idx];
      const lastName = LAST_NAMES[idx];
      const icaDate = hoursAgo(group.hoursAgo + Math.random() * 4);
      const { timeline, completedSteps, milestones } = buildTimeline(
        { firstName, lastName },
        group.stage,
        group.status,
        icaDate
      );

      const hasResponse = timeline.some((e) => e.type === "sms-received");
      const lastResponse = [...timeline]
        .filter((e) => e.type === "sms-received")
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      const lastContact = [...timeline]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      agents.push({
        id: `agent-${String(idx + 1).padStart(3, "0")}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phone: randomPhone(),
        state: STATES[idx % STATES.length],
        icaDate,
        stage: group.stage,
        status: group.status,
        lastContactAt: lastContact?.timestamp || null,
        lastResponseAt: hasResponse ? lastResponse?.timestamp || null : null,
        timeline,
        milestones,
        completedSteps,
        notes: "",
      });
      idx++;
    }
  }

  return agents;
}

function generateAlerts(agents: Agent[]): Alert[] {
  const alerts: Alert[] = [];
  let alertId = 1;

  for (const agent of agents) {
    if (agent.status === "no-engagement") {
      alerts.push({
        id: `alert-${alertId++}`,
        agentId: agent.id,
        agentName: `${agent.firstName} ${agent.lastName}`,
        type: "no-response",
        message: `${agent.firstName} ${agent.lastName} has not responded to any messages. Personal call recommended.`,
        createdAt: hoursAgo(2 + Math.random() * 10),
        acknowledged: false,
      });
    }

    if (agent.status === "needs-attention" && (agent.stage === "hour-48-72" || agent.stage === "week-1")) {
      alerts.push({
        id: `alert-${alertId++}`,
        agentId: agent.id,
        agentName: `${agent.firstName} ${agent.lastName}`,
        type: "silent-48h",
        message: `${agent.firstName} ${agent.lastName} was engaged but has gone silent. Follow up needed.`,
        createdAt: hoursAgo(1 + Math.random() * 5),
        acknowledged: false,
      });
    }
  }

  return alerts;
}

function generateDailySummary(agents: Agent[], alerts: Alert[]): DailySummary {
  const onTrack = agents.filter((a) => a.status === "on-track").length;
  const needsAttention = agents.filter((a) => a.status === "needs-attention").length;
  const noEngagement = agents.filter((a) => a.status === "no-engagement").length;
  const activated = agents.filter((a) => a.stage === "activated").length;
  const newSignups = agents.filter(
    (a) => new Date(a.icaDate).getTime() > Date.now() - 24 * 3600 * 1000
  ).length;

  return {
    date: new Date().toISOString().split("T")[0],
    totalAgents: agents.length,
    onTrack,
    needsAttention,
    noEngagement,
    newSignups,
    activated,
    alertCount: alerts.filter((a) => !a.acknowledged).length,
    agentsNeedingCalls: agents
      .filter((a) => a.status === "no-engagement" || (a.status === "needs-attention" && a.stage === "hour-48-72"))
      .map((a) => a.id),
  };
}

// Export the generated data
export const mockAgents: Agent[] = generateAgents();
export const mockAlerts: Alert[] = generateAlerts(mockAgents);
export const mockDailySummary: DailySummary = generateDailySummary(mockAgents, mockAlerts);
