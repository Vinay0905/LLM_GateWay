import { ButtonHTMLAttributes } from "react";

type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export function NeonButton({ variant = "solid", className = "", ...props }: NeonButtonProps) {
  const base =
    "px-4 py-2 text-xs uppercase tracking-[0.16em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff80]/70 disabled:opacity-50 disabled:cursor-not-allowed";
  const solid =
    "border border-[#ccff80] bg-[#ccff80] text-[#213600] hover:bg-transparent hover:text-[#ccff80]";
  const outline =
    "border border-[#8c947c] text-[#c2cab0] bg-transparent hover:border-[#ccff80] hover:text-[#ccff80]";

  return <button className={`${base} ${variant === "solid" ? solid : outline} ${className}`} {...props} />;
}
