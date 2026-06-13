"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-neon-green/15 bg-black/88 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-bold tracking-[0.08em] text-neon-green">
          {APP_NAME}
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
                    ? "border border-neon-green/50 bg-neon-green/12 text-neon-green shadow-neon-soft"
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
