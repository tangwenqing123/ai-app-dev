/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a',
        'dark-card': '#1e1e1e',
        'dark-input': '#2d2d2d',
        'dark-border': '#404040',
        'dark-text': '#e0e0e0',
      },
    },
  },
  plugins: [],
}
