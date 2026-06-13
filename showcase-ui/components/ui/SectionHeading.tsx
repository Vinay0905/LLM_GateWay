type SectionHeadingProps = {
  tag?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ tag, title, subtitle }: SectionHeadingProps) {
  return (
    <header className="space-y-2">
      {tag ? <p className="font-dot text-xs uppercase tracking-[0.16em] text-neon-cyan">{tag}</p> : null}
      <h2 className="font-display text-2xl tracking-tight text-neon-text md:text-3xl">{title}</h2>
      {subtitle ? <p className="max-w-3xl text-sm text-neon-muted md:text-base">{subtitle}</p> : null}
    </header>
  );
}
