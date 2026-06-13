import { ReactNode } from "react";

type NeonCardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function NeonCard({ title, subtitle, children, className = "" }: NeonCardProps) {
  return (
    <section
      className={`rounded-clean border border-neon-green/22 bg-gradient-to-b from-neon-panel to-neon-panel2 p-5 shadow-panel backdrop-blur ${className}`}
    >
      {title ? <h3 className="text-lg font-bold text-neon-green">{title}</h3> : null}
      {subtitle ? <p className="mt-1 text-sm text-neon-muted">{subtitle}</p> : null}
      <div className={title || subtitle ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
