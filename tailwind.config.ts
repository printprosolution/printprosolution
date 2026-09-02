import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1B2A56", // deep navy blue, matched to the company logo
          50: "#EEF1FA",
          100: "#D7DEF0",
          600: "#1B2A56",
          700: "#141F42",
          800: "#0F1730",
          900: "#0A0F20",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#1E293B",
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#64748B",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        premium: "0 10px 40px -10px rgba(37, 99, 235, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
