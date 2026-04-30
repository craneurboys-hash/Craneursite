import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1E2040",
        paper: "#ffffff",
        acid: "#ff2d2d",
        signal: "#1E2040",
        chrome: "#e7f0ff",
        "logo-blue": "#1E2040"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        display: ["Arial Black", "Arial", "Helvetica", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
