/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        broadcast: {
          black: '#020617',
          dark: '#0f172a',
          accent: '#3b82f6',
          danger: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}