import { ReactNode } from "react";

type NeonCardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function NeonCard({ title, subtitle, children, className = "" }: NeonCardProps) {
  return (
    <section className={`glass-panel p-5 ${className}`}>
      {title ? <h3 className="font-display text-xl text-[#ccff80]">{title}</h3> : null}
      {subtitle ? <p className="mt-1 text-sm text-[#c2cab0]">{subtitle}</p> : null}
      <div className={title || subtitle ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
