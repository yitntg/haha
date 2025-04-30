/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-dark': '#1a1b1e',
        'input-dark': '#2c2d30',
        'button-dark': '#27282b',
        'primary-blue': '#4169e1'
      }
    },
  },
  plugins: [],
} 