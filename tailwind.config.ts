import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#f97316",
          dark: "#ea580c",
        },
        surface: {
          DEFAULT: "#111111",
          card: "#1a1a1a",
          elevated: "#222222",
        },
      },
    },
  },
  plugins: [],
};

export default config;
