export default function StatCard({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-bg-secondary border border-border-main rounded-lg p-4">
      <div className="text-text-secondary text-xs uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color || 'text-text-primary'}`}>{value}</div>
      {sub && <div className="text-text-secondary text-xs mt-1">{sub}</div>}
    </div>
  );
}
