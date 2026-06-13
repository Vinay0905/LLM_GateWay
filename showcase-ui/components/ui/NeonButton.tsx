import { ButtonHTMLAttributes } from "react";

type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export function NeonButton({ variant = "solid", className = "", ...props }: NeonButtonProps) {
  const base =
    "rounded-clean px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green disabled:opacity-50 disabled:cursor-not-allowed";
  const solid =
    "bg-neon-green text-black shadow-neon hover:translate-y-[-1px] hover:shadow-[0_0_24px_rgba(57,255,20,0.45)]";
  const outline =
    "border border-neon-green/70 text-neon-green bg-transparent shadow-neon-soft hover:bg-neon-green/10 hover:shadow-neon";

  return <button className={`${base} ${variant === "solid" ? solid : outline} ${className}`} {...props} />;
}
