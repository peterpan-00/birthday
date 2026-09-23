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
        mau: {
          dark: "#0b0813",
          deep: "#150f24",
          surface: "#1c1430",
          card: "rgba(35, 25, 58, 0.6)",
          border: "rgba(255, 215, 185, 0.12)",
          rose: "#f4a6b6",
          blush: "#ffccd5",
          peach: "#ffd8be",
          cream: "#fff8f0",
          lavender: "#d8b4f8",
          purple: "#9b72cf",
          plum: "#4b1e4a",
          gold: "#fbd38d",
          accent: "#ff70a6"
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
