"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-neon-cyan/20 bg-black/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-dot text-[10px] uppercase tracking-[0.2em] text-neon-cyan">nexus.ui</span>
          <span className="font-display text-sm tracking-[0.08em] text-neon-green">{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-clean px-3 py-1 text-sm transition ${
                  isActive
                    ? "border border-neon-green/45 bg-neon-green/10 text-neon-green shadow-neon-soft"
                    : "border border-transparent text-neon-text hover:border-neon-cyan/35 hover:text-neon-cyan"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
