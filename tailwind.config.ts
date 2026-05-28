import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#0F172A",
          green: {
            500: "#22C55E",
            600: "#16A34A",
            soft: "#DFF7E8"
          },
          blue: {
            500: "#3B82F6",
            soft: "#E0EAFF"
          }
        },
        surface: "#FFFFFF",
        bg: "#F8FAFC",
        muted: "#64748B",
        faint: "#94A3B8",
        line: "#E2E8F0"
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "SF Pro Text",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ]
      },
      fontSize: {
        "2xs": "11px",
        xs: "12px",
        sm: "13px",
        base: "14px",
        md: "16px",
        lg: "18px",
        xl: "22px",
        "2xl": "28px",
        "3xl": "36px"
      },
      borderRadius: {
        card: "18px",
        btn: "12px",
        pill: "999px"
      },
      boxShadow: {
        card: "0 4px 24px rgba(15,23,42,0.06)",
        cta: "0 8px 28px rgba(34,197,94,0.25)",
        pop: "0 12px 40px rgba(15,23,42,0.12)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        },
        ringFill: {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "var(--target)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        ringFill: "ringFill 1.2s ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;
