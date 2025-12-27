import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // MedVision custom colors
        medical: {
          cyan: "hsl(var(--medical-cyan))",
          "cyan-glow": "hsl(var(--medical-cyan-glow))",
          blue: "hsl(var(--medical-blue))",
          dark: "hsl(var(--medical-dark))",
          darker: "hsl(var(--medical-darker))",
          surface: "hsl(var(--medical-surface))",
          "surface-hover": "hsl(var(--medical-surface-hover))",
        },
        risk: {
          low: "hsl(var(--risk-low))",
          medium: "hsl(var(--risk-medium))",
          high: "hsl(var(--risk-high))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(190 85% 50% / 0.3)" },
          "50%": { boxShadow: "0 0 25px hsl(190 85% 50% / 0.5)" },
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "14%": { transform: "scale(1.05)", opacity: "1" },
          "28%": { transform: "scale(1)", opacity: "0.8" },
          "42%": { transform: "scale(1.03)", opacity: "0.9" },
          "70%": { transform: "scale(1)", opacity: "0.8" },
        },
        "scan-line": {
          "0%": { top: "0%", opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "draw-path": {
          from: { strokeDashoffset: "1000" },
          to: { strokeDashoffset: "0" },
        },
        "heatmap-appear": {
          from: { opacity: "0", filter: "blur(10px)" },
          to: { opacity: "0.7", filter: "blur(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "progress": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in-down": "fade-in-down 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "scan-line": "scan-line 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "draw-path": "draw-path 2s ease-out forwards",
        "heatmap-appear": "heatmap-appear 1.5s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "progress": "progress 2s ease-out forwards",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-medical": "linear-gradient(135deg, hsl(var(--medical-cyan)) 0%, hsl(var(--medical-blue)) 100%)",
        "gradient-dark": "linear-gradient(180deg, hsl(var(--medical-dark)) 0%, hsl(var(--medical-darker)) 100%)",
        "gradient-glow": "radial-gradient(circle at center, hsl(var(--medical-cyan) / 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-sm": "0 0 10px hsl(var(--medical-cyan) / 0.2)",
        "glow": "0 0 20px hsl(var(--medical-cyan) / 0.3)",
        "glow-lg": "0 0 40px hsl(var(--medical-cyan) / 0.4)",
        "glow-xl": "0 0 60px hsl(var(--medical-cyan) / 0.5)",
        "inner-glow": "inset 0 0 20px hsl(var(--medical-cyan) / 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
