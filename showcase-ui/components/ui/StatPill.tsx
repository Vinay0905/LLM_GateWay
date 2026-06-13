type StatPillProps = {
  label: string;
  value: string | number;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-clean border border-neon-green/40 bg-black/40 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-neon-muted">{label}</p>
      <p className="text-sm font-semibold text-neon-text">{value}</p>
    </div>
  );
}
