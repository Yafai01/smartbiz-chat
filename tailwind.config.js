/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wa-dark-bg': '#0B141A',
        'wa-secondary': '#111B21',
        'wa-accent': '#202C33',
        'wa-green': '#25D366',
        'wa-green-dark': '#1DA851',
        'wa-text': '#E9EDEF',
        'wa-subtext': '#8696A0',
      },
    },
  },
  plugins: [],
}
