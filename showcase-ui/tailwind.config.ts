import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          black: "#05070A",
          green: "#39FF14",
          cyan: "#00F5FF",
          panel: "#0B1117",
          text: "#E8F5E9",
          muted: "#7BAA84"
        }
      },
      boxShadow: {
        neon: "0 0 18px rgba(57,255,20,0.35)",
        "neon-soft": "0 0 10px rgba(57,255,20,0.2)"
      },
      borderRadius: {
        clean: "12px"
      }
    }
  },
  plugins: []
};

export default config;
