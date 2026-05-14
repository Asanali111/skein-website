import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          0: "var(--bg-0)",
          1: "var(--bg-1)",
          2: "var(--bg-2)",
          3: "var(--bg-3)",
        },
        fg: {
          0: "var(--fg-0)",
          1: "var(--fg-1)",
          2: "var(--fg-2)",
          3: "var(--fg-3)",
        },
        divider: "var(--divider)",
        primary: "#6d28d9",
        spark: "#65a30d",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        content: "1100px",
        narrow: "44rem",
      },
      fontSize: {
        wordmark: ["6rem", { lineHeight: "0.9", letterSpacing: "-0.045em" }],
        tagline: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
      },
      boxShadow: {
        spark: "0 0 8px #65a30d",
      },
    },
  },
  plugins: [],
};

export default config;
