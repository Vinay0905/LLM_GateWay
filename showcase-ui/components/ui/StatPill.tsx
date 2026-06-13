type StatPillProps = {
  label: string;
  value: string | number;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="border border-[#424936] bg-[#0e0e0e] px-3 py-2">
      <p className="text-xs uppercase tracking-[0.12em] text-[#8c947c]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#e5e2e1]">{value}</p>
    </div>
  );
}
