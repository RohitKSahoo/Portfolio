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
        heading: ['Bebas Neue', 'Impact', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
