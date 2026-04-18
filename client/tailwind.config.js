/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ IMPORTANT

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        bg: "#0F0F0F",
        card: "#1A1A1A",
        primary: "#7C3AED",
        accent: "#A78BFA",
        text: "#FFFFFF",
        subtext: "#9CA3AF",
        border: "#2A2A2A",
      },
    },
  },

  plugins: [],
};