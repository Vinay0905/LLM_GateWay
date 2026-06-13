type StatPillProps = {
  label: string;
  value: string | number;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-clean border border-neon-green/25 bg-black/35 px-3 py-2 shadow-neon-soft">
      <p className="text-xs uppercase tracking-wide text-neon-muted">{label}</p>
      <p className="text-sm font-semibold text-neon-text">{value}</p>
    </div>
  );
}
