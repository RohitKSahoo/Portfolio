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
        satoshi: ['Satoshi', 'var(--font-heading)', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        amatic: ['"Amatic SC"', 'cursive', 'sans-serif'],
        alex: ['"Alex Brush"', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
