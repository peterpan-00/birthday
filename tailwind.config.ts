import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      // Must be defined before default screens so min-width CSS cascade order is preserved
      xs: "375px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        memory: {
          midnight: "var(--memory-midnight)",
          plum: "var(--memory-plum)",
          "plum-light": "var(--memory-plum-light)",
          cream: "var(--memory-cream)",
          "cream-soft": "var(--memory-cream-soft)",
          blush: "var(--memory-blush)",
          lavender: "var(--memory-lavender)",
          "lavender-soft": "var(--memory-lavender-soft)",
          peach: "var(--memory-peach)",
          gold: "var(--memory-gold)",
        },
        mau: {
          dark: "var(--memory-midnight)",
          deep: "var(--memory-plum)",
          midnight: "var(--memory-midnight)",
          mauve: "var(--memory-plum-light)",
          surface: "var(--memory-plum)",
          card: "rgba(36, 21, 43, 0.65)",
          border: "rgba(247, 235, 221, 0.12)",
          rose: "var(--memory-blush)",
          blush: "var(--memory-blush)",
          peach: "var(--memory-peach)",
          cream: "var(--memory-cream-soft)",
          lavender: "var(--memory-lavender)",
          purple: "var(--memory-lavender-soft)",
          plum: "var(--memory-plum-light)",
          gold: "var(--memory-gold)",
          accent: "var(--memory-blush)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Cinzel Decorative", "Cinzel", "serif"],
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", filter: "blur(20px)" },
          "50%": { opacity: "0.8", filter: "blur(30px)" },
        },
      },
      backgroundImage: {
        "mau-gradient": "radial-gradient(ellipse at top, #2d1840 0%, #150f24 50%, #0b0813 100%)",
        "warm-glow": "radial-gradient(circle at center, rgba(255, 180, 162, 0.15) 0%, rgba(11, 8, 19, 0) 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
