import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "shadow-heavy": "var(--shadow-heavy)",
        "shadow-card": "var(--shadow-card)",
        "shadow-border": "var(--shadow-border)",
        "crystal-clear": "var(--crystal-clear)",
        amethyst: "var(--amethyst)",
        "amethyst-accessible": "var(--amethyst-accessible)",
        "on-accent": "var(--on-accent)",
        periwinkle: "var(--periwinkle)",
        mint: "var(--mint)",
        plum: "var(--plum)",
        slate: "var(--slate)",
        muted: "var(--muted)",
        caption: "var(--caption)",
        subtle: "var(--subtle)",
        "status-up": "var(--status-up)",
        "status-down": "var(--status-down)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        label: ["Oswald", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
