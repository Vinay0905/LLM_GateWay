"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppTheme } from "@/app/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, crtEnabled, toggleCrt } = useAppTheme();

  const links = [
    { name: "Home", href: "/" },
    { name: "Tutorial", href: "/tutorial" },
    { name: "Playground", href: "/playground" },
    { name: "Chat", href: "/chat" },
    { name: "About", href: "/about" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-outline-variant bg-background/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display text-xl font-bold tracking-tighter text-primary uppercase hover:opacity-85 transition-opacity">
            LLM GATEWAY
          </Link>
          <div className="hidden sm:block h-4 w-px bg-outline-variant"></div>
          <span className="hidden sm:inline font-display text-xs font-bold tracking-widest text-secondary uppercase animate-pulse">
            {theme === "gateway-os" ? "GATEWAY_OS_V1" : "NEON_TOKYO_V2"}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display text-xs font-semibold uppercase tracking-widest transition-all ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1 font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions / Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* CRT Monitor Filter */}
          <button
            onClick={toggleCrt}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-all group ${
              crtEnabled
                ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(204,255,128,0.15)]"
                : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary"
            }`}
            title="Toggle Retro CRT Scanlines"
          >
            <span className="material-symbols-outlined text-[18px]">
              monitor
            </span>
            <span className="font-technical-sm text-xs font-medium tracking-tight">
              CRT
            </span>
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant bg-surface-container-lowest rounded-lg hover:border-primary hover:text-primary transition-all text-on-surface-variant group"
            title="Toggle Retro Theme"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary group-hover:animate-spin">
              {theme === "gateway-os" ? "terminal" : "visibility"}
            </span>
            <span className="font-technical-sm text-xs font-medium tracking-tight">
              {theme === "gateway-os" ? "Gateway OS" : "Neon Tokyo"}
            </span>
          </button>

          {/* Settings Shell */}
          <button className="material-symbols-outlined p-2 hover:bg-primary/10 rounded-full transition-all text-on-surface-variant hover:text-primary">
            settings
          </button>
        </div>
      </div>
    </nav>
  );
}
