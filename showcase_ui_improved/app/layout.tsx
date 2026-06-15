import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeCanvas from "@/components/ThemeCanvas";

export const metadata: Metadata = {
  title: "LLM GATEWAY | HIGH-PERFORMANCE ROUTING",
  description: "Polyglot production-grade LLM API Gateway and management showcase interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col pb-8 pt-16 selection:bg-primary selection:text-black">
        <ThemeProvider>
          <ThemeCanvas />
          <Navbar />
          <main className="flex-grow flex flex-col w-full max-w-[1440px] mx-auto px-4 sm:px-6 transition-all duration-300">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
