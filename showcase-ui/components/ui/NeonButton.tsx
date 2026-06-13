import { ButtonHTMLAttributes } from "react";

type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export function NeonButton({ variant = "solid", className = "", ...props }: NeonButtonProps) {
  const base =
    "rounded-clean px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/70 disabled:opacity-50 disabled:cursor-not-allowed";
  const solid =
    "border border-neon-green/50 bg-neon-green/14 text-neon-text shadow-neon-soft hover:translate-y-[-1px] hover:border-neon-green/75 hover:bg-neon-green/20 hover:shadow-neon";
  const outline =
    "border border-neon-green/40 text-neon-green bg-transparent shadow-neon-soft hover:border-neon-cyan/65 hover:bg-neon-cyan/10 hover:text-neon-cyan";

  return <button className={`${base} ${variant === "solid" ? solid : outline} ${className}`} {...props} />;
}
