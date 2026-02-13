export const STAGES = [
  { id: 1, name: 'ICA Submitted', short: 'ICA', color: '#6366f1' },
  { id: 2, name: 'Welcome Text Sent', short: 'Welcome', color: '#8b5cf6' },
  { id: 3, name: 'Pushback Email Sent', short: 'Email', color: '#a855f7' },
  { id: 4, name: 'CE Part 1 Booked', short: 'CE1 Book', color: '#d946ef' },
  { id: 5, name: 'CE Part 1 Completed', short: 'CE1 Done', color: '#ec4899' },
  { id: 6, name: 'CE Part 2 Booked', short: 'CE2 Book', color: '#f43f5e' },
  { id: 7, name: 'CE Part 2 Completed', short: 'CE2 Done', color: '#f97316' },
  { id: 8, name: 'Onboarding 2 Scheduled', short: 'OB2 Sched', color: '#eab308' },
  { id: 9, name: 'Onboarding 2 In Progress', short: 'OB2 Active', color: '#84cc16' },
  { id: 10, name: 'Field Training Active', short: 'Field', color: '#22c55e' },
  { id: 11, name: 'Independent / Producing', short: 'Producing', color: '#14b8a6' },
] as const;

export type StageId = (typeof STAGES)[number]['id'];

export function getStageName(id: number): string {
  return STAGES.find(s => s.id === id)?.name ?? 'Unknown';
}

export function getStageColor(id: number): string {
  return STAGES.find(s => s.id === id)?.color ?? '#6b7280';
}
