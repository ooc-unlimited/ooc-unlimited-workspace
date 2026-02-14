export const STAGES = [
  { id: 1, name: 'ICA Signed', short: 'ICA', color: '#6366f1', description: 'Associate agreement signed ($199 paid). Welcome sequence triggered.' },
  { id: 2, name: 'Exam Scheduled', short: 'Exam Sched', color: '#8b5cf6', description: 'Licensing exam scheduled (target: 7-10 days out). 7-day SMS drip active.' },
  { id: 3, name: 'Onboarding 1 — Client Experience', short: 'OB1', color: '#a855f7', description: 'Personal 1-on-1 within 48h of agent code. Client experience (4 buckets, IUL Family Bank), schedule exam, practice what you preach.' },
  { id: 4, name: 'Licensed', short: 'Licensed', color: '#d946ef', description: 'Agent passed state licensing exam. Ready for business planning.' },
  { id: 5, name: 'Onboarding 2 — Business Plan', short: 'OB2', color: '#ec4899', description: 'Business plan, set grand opening date, set net license date, set CFT date. Deliberate intention.' },
  { id: 6, name: 'Grand Opening Scheduled', short: 'GO Sched', color: '#f43f5e', description: 'Grand opening date set. Guest list building, social media promo, 3-way texts with warm market.' },
  { id: 7, name: 'Grand Opening Complete', short: 'GO Done', color: '#f97316', description: 'Grand opening executed. Agent has done all the awkward stuff — 3-way texts, spouse meeting, became client.' },
  { id: 8, name: 'Onboarding 3 — Post-Grand Opening', short: 'OB3', color: '#eab308', description: 'The breakthrough piece. System: compensation, contracts, 5 ways to gain clients. Action: 3-way texts with CPAs, teachers. Field training begins.' },
  { id: 9, name: 'Field Training', short: 'Field', color: '#84cc16', description: 'Real appointments, real exposure. Product education happens HERE, not on Zoom. Run by Gary + sidelines/uplines.' },
  { id: 10, name: 'Net Licensed / CFT', short: 'Net/CFT', color: '#22c55e', description: 'Certified Field Trainer. Can run onboardings and field training independently. Now eligible for Thursday T2 trainings.' },
  { id: 11, name: 'Independent', short: 'Independent', color: '#14b8a6', description: 'Fully independent, producing agent. Running their own system, recruiting, building downline.' },
] as const;

export type StageId = (typeof STAGES)[number]['id'];

export function getStageName(id: number): string {
  return STAGES.find(s => s.id === id)?.name ?? 'Unknown';
}

export function getStageColor(id: number): string {
  return STAGES.find(s => s.id === id)?.color ?? '#6b7280';
}

export function getStageDescription(id: number): string {
  return STAGES.find(s => s.id === id)?.description ?? '';
}
