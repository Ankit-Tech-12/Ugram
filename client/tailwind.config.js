/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ controlled by <html class="dark">

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        // 🎯 dynamic theme colors (from CSS variables)
        bg: "var(--bg)",
        card: "var(--card)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        text: "var(--text)",
        subtext: "var(--subtext)",
        border: "var(--border)",
      },
    },
  },

  plugins: [],
};