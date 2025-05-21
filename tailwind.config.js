/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#111C2D",
        surface: "#0F172A",
        border: "#334155",
        accent: "#94A3B8",
        text: "#F1F5F9",
        muted: "#9CA3AF",
        primary: "#3B82F6",       // Azul vivo
        primaryDark: "#1E3A8A",   // Azul escuro
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      spacing: {
        sidebar: "260px",
      },
    },
  },
  plugins: [],
}
