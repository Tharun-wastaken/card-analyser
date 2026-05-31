/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08080A",
          900: "#0C0C0E",
          850: "#101013",
          800: "#15151A",
          700: "#1E1E24",
          600: "#2A2A31",
          500: "#3A3A43",
        },
        rule: {
          DEFAULT: "#22222A",
          strong: "#33333D",
          faint: "#18181E",
        },
        crimson: {
          50: "#FBEAEC",
          200: "#EBA6AD",
          300: "#E08791",
          400: "#D85A65",
          500: "#C8323C",
          600: "#A82831",
          700: "#841F26",
        },
        steel: {
          100: "#E7E7EA",
          200: "#C7C7CD",
          300: "#A6A6AE",
          400: "#83838C",
          500: "#5E5E68",
          600: "#46464E",
        },
        chalk: "#F7F7F4",
        gold: "#C8A14A",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        caption: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.18em" }],
      },
      boxShadow: {
        plate: "0 24px 60px -32px rgba(0,0,0,0.9)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
