import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          black: "#0A0A0A",
          dark: "#111111",
          card: "#1A1A1A",
          border: "#2A2A2A",
          muted: "#555555",
          light: "#AAAAAA",
          white: "#F5F5F5",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
