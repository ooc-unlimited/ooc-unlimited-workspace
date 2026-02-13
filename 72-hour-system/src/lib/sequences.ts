import { SequenceStep } from "./types";

export const ACTIVATION_SEQUENCE: SequenceStep[] = [
  {
    key: "hour-0",
    hour: 0,
    label: "Welcome Message",
    messageTemplate:
      "Welcome to GFI, {{firstName}}! 🎉 We're excited to have you on the team. Quick question — what made you decide to join? I'd love to hear your story. - Gary",
  },
  {
    key: "hour-6",
    hour: 6,
    label: "Quick-Start Checklist",
    messageTemplate:
      "Hey {{firstName}}, here's your Quick-Start Checklist to get rolling: {{checklistLink}} — Knock out what you can today and you'll be ahead of 90% of new agents. Let me know if you have any questions!",
  },
  {
    key: "hour-12",
    hour: 12,
    label: "Checklist Follow-Up",
    messageTemplate:
      "Hey {{firstName}}, did you get a chance to look at the checklist? Even completing just the first 2 items puts you in a great position. What questions came up?",
  },
  {
    key: "hour-24",
    hour: 24,
    label: "Training Video + Task",
    messageTemplate:
      "Good morning {{firstName}}! Here's a short training video that's helped a lot of our top agents get started: {{trainingLink}} — After you watch it, your micro-task is to write down 3 people you'd want to share this opportunity with. That's it!",
  },
  {
    key: "hour-36",
    hour: 36,
    label: "Check-In",
    messageTemplate:
      "Hey {{firstName}}, just checking in — how's everything going so far? Any roadblocks I can help clear? I want to make sure you've got everything you need to hit the ground running.",
  },
  {
    key: "hour-48",
    hour: 48,
    label: "48-Hour Alert",
    messageTemplate:
      "{{firstName}}, I know getting started can feel overwhelming. I'm here to help. Can we jump on a quick 10-minute call today? I'll walk you through exactly what to do first. When works best for you?",
    isAlert: true,
    alertMessage:
      "⚠️ {{firstName}} {{lastName}} has not responded in 48 hours. Personal call needed ASAP.",
  },
  {
    key: "hour-72",
    hour: 72,
    label: "Final Check-In / Escalation",
    messageTemplate:
      "{{firstName}}, I've been trying to connect with you this week. I don't want you to miss out on the momentum of getting started. Reply YES if you're still in, and I'll make sure we get you set up today.",
    isAlert: true,
    alertMessage:
      "🚨 {{firstName}} {{lastName}} — 72 hours with no engagement. Final escalation required.",
  },
];

export const STAGE_LABELS: Record<string, string> = {
  "hour-0-12": "Hour 0–12",
  "hour-12-24": "Hour 12–24",
  "hour-24-48": "Hour 24–48",
  "hour-48-72": "Hour 48–72",
  "week-1": "Week 1",
  activated: "Activated",
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "on-track": { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  "needs-attention": { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  "no-engagement": { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
};

export const STATUS_LABELS: Record<string, string> = {
  "on-track": "On Track",
  "needs-attention": "Needs Attention",
  "no-engagement": "No Engagement",
};
