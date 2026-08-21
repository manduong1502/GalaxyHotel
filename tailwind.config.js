/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hotel: {
          navy: '#002744',
          deep: '#013e5b',
          dark: '#0a1120',
          gold: '#ceb08f',
          goldLight: '#e4d2bc',
          goldDark: '#a3815c',
          accent: '#c49a6c',
          cream: '#fcfbf8',
          sand: '#f5f0e8',
          charcoal: '#222222',
          muted: '#6b7280',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        brand: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 39, 68, 0.12)',
        'luxury-hover': '0 30px 60px -15px rgba(0, 39, 68, 0.22)',
        'gold-glow': '0 0 25px rgba(206, 176, 143, 0.35)',
      }
    },
  },
  plugins: [],
}
