import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "shadow-heavy": "#1A1919",
        "shadow-card": "#292928",
        "shadow-border": "#393838",
        "crystal-clear": "#F5F5F4",
        amethyst: "#AC75FF",
        "amethyst-accessible": "#8A38F5",
        periwinkle: "#899CFA",
        mint: "#B0F7BA",
        plum: "#654A8C",
        slate: "#525B89",
        muted: "#797777",
        caption: "#484747",
        subtle: "#9A9998",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
