/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'weather-bg': '#0f1220',
        'weather-panel': '#171a2b',
        'weather-muted': '#8a90a6',
        'weather-text': '#e7ebff',
        'weather-acc': '#6ea8fe',
        'weather-ok': '#8ce99a',
        'weather-warn': '#ffd43b',
        'weather-danger': '#ff8787',
      },
      borderRadius: {
        'weather': '16px',
      }
    },
  },
  plugins: [],
}
