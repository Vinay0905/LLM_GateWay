"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#424936] bg-[#131313]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl tracking-tight text-[#ccff80] uppercase">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 text-xs uppercase tracking-[0.16em] transition ${
                  isActive
                    ? "border-b-2 border-[#ccff80] text-[#ccff80]"
                    : "text-[#c2cab0] hover:text-[#ccff80]"
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
