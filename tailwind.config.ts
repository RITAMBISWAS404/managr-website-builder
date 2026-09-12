import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * ManagR design system → Tailwind theme.
 * All values are CSS variables from src/styles/globals.css.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1440px" } },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        border: { DEFAULT: "var(--border)", subtle: "var(--border-subtle)", strong: "var(--border-strong)" },
        input: "var(--input)",
        ring: { DEFAULT: "rgb(var(--ring) / <alpha-value>)", soft: "var(--brand-ring-soft)" },
        background: "var(--background)",
        workspace: "var(--workspace)",
        overlay: "var(--overlay)",
        surface: { DEFAULT: "var(--surface)", 2: "var(--surface-2)", sunken: "var(--sunken)" },
        /* also expose the sunken well as a top-level colour — the codebase writes
           `bg-sunken` (not `bg-surface-sunken`), which otherwise resolves to nothing */
        sunken: "var(--sunken)",
        panel: {
          DEFAULT: "var(--panel)",
          header: "var(--panel-header)",
          section: "var(--panel-section)",
          hover: "var(--panel-hover)",
          border: "var(--panel-border)",
        },
        foreground: "var(--foreground)",
        faint: "var(--faint)",
        brand: { DEFAULT: "var(--brand)", strong: "var(--brand-strong)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)", strong: "var(--primary-strong)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        navy: { DEFAULT: "var(--navy)", foreground: "var(--navy-foreground)", active: "var(--navy-active)", hover: "var(--navy-hover)", border: "var(--navy-border)" },
        "secondary-blue": { DEFAULT: "var(--secondary-blue)", surface: "var(--secondary-blue-surface)", border: "var(--secondary-blue-border)" },
        tint: {
          blue: "var(--tint-blue)", "blue-fg": "var(--tint-blue-fg)",
          green: "var(--tint-green)", "green-fg": "var(--tint-green-fg)",
          amber: "var(--tint-amber)", "amber-fg": "var(--tint-amber-fg)",
          purple: "var(--tint-purple)", "purple-fg": "var(--tint-purple-fg)",
          coral: "var(--tint-coral)", "coral-fg": "var(--tint-coral-fg)",
          cyan: "var(--tint-cyan)", "cyan-fg": "var(--tint-cyan-fg)",
        },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)", surface: "var(--destructive-surface)", border: "var(--destructive-border)" },
        call: "var(--call)",
        whatsapp: "var(--whatsapp)",
        success: { DEFAULT: "var(--success)", foreground: "var(--success-foreground)", surface: "var(--success-surface)", border: "var(--success-border)" },
        warning: { DEFAULT: "var(--warning)", foreground: "var(--warning-foreground)", surface: "var(--warning-surface)", wash: "var(--warning-wash)", border: "var(--warning-border)" },
        info: { DEFAULT: "var(--info)", foreground: "var(--info-foreground)", surface: "var(--info-surface)", border: "var(--info-border)" },
        advanced: { DEFAULT: "var(--advanced)", foreground: "var(--advanced-foreground)", surface: "var(--advanced-surface)", border: "var(--advanced-border)" },
      },
      borderRadius: {
        xs: "var(--radius-xs)",   /* 5  — checkbox, kbd */
        sm: "var(--radius-sm)",   /* 8  — icon buttons, segmented, radius'd chips */
        md: "var(--radius-sm)",   /* 8  — aligned to sm */
        lg: "var(--radius)",      /* 10 — buttons, inputs, rows */
        xl: "var(--radius-lg)",   /* 14 — medium cards */
        "2xl": "var(--radius-lg)",/* 14 — large cards, modals, website frame */
      },
      borderWidth: { DEFAULT: "1px", hair: "1px" },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-e1)",
        e1: "var(--shadow-e1)",
        e2: "var(--shadow-e2)",
        frame: "var(--shadow-frame)",
        card: "var(--shadow-e1)",
        modal: "var(--shadow-pop)",
        pop: "var(--shadow-pop)",
      },
      fontSize: {
        micro: ["10.5px", { lineHeight: "14px", letterSpacing: "0.062em" }],
        pill: ["11px", { lineHeight: "16px", letterSpacing: "0.005em" }],
        caption: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "18px" }],
        body: ["14px", { lineHeight: "20px" }],
        section: ["15px", { lineHeight: "21px", letterSpacing: "-0.006em" }],
        title: ["19px", { lineHeight: "25px", letterSpacing: "-0.018em" }],
        display: ["24px", { lineHeight: "29px", letterSpacing: "-0.022em" }],
        "display-lg": ["27px", { lineHeight: "32px", letterSpacing: "-0.024em" }],
      },
      spacing: { 4.5: "18px", 5.5: "22px", 7: "28px", 13: "52px", 15: "60px", 18: "72px" },
      transitionTimingFunction: { smooth: "var(--ease)" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.18s var(--ease)",
        "accordion-up": "accordion-up 0.18s var(--ease)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
