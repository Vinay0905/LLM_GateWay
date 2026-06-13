import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { APP_NAME } from "@/lib/constants";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Neon retro showcase app for LLM Gateway capabilities."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} scanline`}>
        <TopNav />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 pt-24">{children}</main>
      </body>
    </html>
  );
}
