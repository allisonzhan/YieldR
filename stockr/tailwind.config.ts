import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        "card-dark": "#0f172a",
        "accent-green": "#16f2b3",
        "accent-yellow": "#facc15",
        "accent-red": "#f87171",
      },
      boxShadow: {
        glass: "0 20px 50px rgba(15, 23, 42, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
