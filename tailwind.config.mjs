/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      animation: {
        flash: "flash 1s ease-in-out infinite",
        lighthouse: "lighthouse 2s infinite",
      },
      keyframes: {
        flash: {
          "0%": { backgroundColor: "#fff", boxShadow: "0 0 20px #fff" }, // Rojo
          "100%": { backgroundColor: "#330072", boxShadow: "0 0 20px #330072" }, // Verde
        },
        lighthouse: {
          "0%": { opacity: "0" },
          "50%": { opacity: "1" },  // Se ilumina
          "100%": { opacity: "0" }, // Desaparece
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        error: {
          50: "#FFB8C9",
          300: "#FF527B",
          500: "#ED0039",
          700: "#B8002C",
          900: "#660019",
        },
        alert: {
          50: "#FFEEB3",
          300: "#FFDA57",
          500: "#FFCA10",
          700: "#DBAB00",
          900: "#997700",
        },
        success: {
          50: "#D3F5EB",
          300: "#1AFFBA",
          500: "#00ECA5",
          700: "#00B880",
          900: "#006B4B",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          with: {
            100: "#fff"
          },
          purple: {
            50: "#E7DDF8",
            300: "#AB88E7",
            500: "#6429CD",
            700: "#330072",
            900: "#1F0D3F",
          },
          gray: {
            50: "#D8D8D6",
            300: "#75756D",
            500: "#1D1D1B",
            700: "#141413",
            900: "#030302",
          },
          indigo: {
            50: "#F6F6FC",
            300: "#DFDFFF",
            500: "#BDBDFF",
            700: "#8A8AFF",
            900: "#4646FF",
          },
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          fuchsia: {
            50: "#FDF9FF",
            300: "#F3D7FF",
            500: "#E4A4FF",
            700: "#DD52DD",
            900: "#7500A0",
          },
          purple: {
            50: "#F0DCFF",
            300: "#BB65FF",
            500: "#9610FF",
            700: "#440099",
            900: "#150030",
          },
        },
        tertiary:{
          50: "#FDECD0",
          300: "#FACA7E",
          500: "#F8AF3C",
          700: "#C77C07",
          900: "#754904",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
