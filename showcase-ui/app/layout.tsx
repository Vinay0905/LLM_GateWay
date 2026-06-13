import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DotGothic16, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { APP_NAME } from "@/lib/constants";

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-display"
});

const dotFont = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dot"
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Neon retro showcase app for LLM Gateway capabilities."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} ${dotFont.variable} scanline`}>
        <TopNav />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
