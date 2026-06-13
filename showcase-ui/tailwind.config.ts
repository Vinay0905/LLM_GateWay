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
          green: "#8AF28E",
          cyan: "#7DE8F5",
          purple: "#B89CFF",
          panel: "#0B1117",
          panel2: "#0D161F",
          text: "#E2EEE3",
          muted: "#89A891"
        }
      },
      boxShadow: {
        neon: "0 0 10px rgba(138,242,142,0.18)",
        "neon-soft": "0 0 6px rgba(138,242,142,0.14)",
        panel: "0 8px 24px rgba(0,0,0,0.35)"
      },
      borderRadius: {
        clean: "12px"
      }
    }
  },
  plugins: []
};

export default config;
