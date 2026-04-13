/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: 'var(--theme-color)',
        black: '#000000',
        dark: '#121212',
        grey: '#888888',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        sans: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}
