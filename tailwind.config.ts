import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "shadow-heavy": "#150F0A",
        "shadow-card": "#241A10",
        "shadow-border": "#3D2C1A",
        "crystal-clear": "#F1E4CC",
        amethyst: "#C4432E",
        "amethyst-accessible": "#C4432E",
        periwinkle: "#C8A24A",
        mint: "#C8A24A",
        plum: "#6B3A1E",
        slate: "#8A6A45",
        muted: "#9C8A6E",
        caption: "#6B5A42",
        subtle: "#C7B79A",
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
