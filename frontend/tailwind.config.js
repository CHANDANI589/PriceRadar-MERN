/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          light: "#134074",
          dark: "#071A33",
        },
        mustard: {
          DEFAULT: "#F2B705",
          light: "#FFD447",
        },
        coral: {
          DEFAULT: "#FF4D6D",
          light: "#FF7A93",
        },
        offwhite: "#F7F9FC",
        slate: {
          text: "#1E293B",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(11, 37, 69, 0.08)",
        glow: "0 0 0 3px rgba(242, 183, 5, 0.35)",
      },
      keyframes: {
        raceGrow: {
          "0%": { width: "0%" },
          "100%": { width: "var(--target-width)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(242,183,5,0.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(242,183,5,0)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
      },
      animation: {
        race: "raceGrow 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
        pulseGlow: "pulseGlow 2s infinite",
        fadeUp: "fadeUp 0.5s ease forwards",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
