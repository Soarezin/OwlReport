module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        owl: {
          primary: '#1E2B38',
          background: '#0F172A',
          surface: '#1E293B',
          text: '#F1F5F9',
          secondaryText: '#94A3B8',
          accent: '#3B82F6',
          danger: '#EF4444',
          success: '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      display: ['Poppins', 'sans-serif'], // opcional para headers
    }
  },
  plugins: [],
}
