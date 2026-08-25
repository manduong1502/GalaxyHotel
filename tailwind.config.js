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
          navy: '#121824',
          deep: '#1E293B',
          dark: '#0B0F19',
          gold: '#B89369',
          goldLight: '#E8DCB9',
          goldDark: '#8A6943',
          bronze: '#A6825B',
          accent: '#A6825B',
          cream: '#FAF9F5',
          sand: '#F3EFE6',
          stone: '#EAE5DC',
          charcoal: '#1A1A1A',
          muted: '#666666',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        brand: ['"Playfair Display"', '"Plus Jakarta Sans"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.07), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'luxury-hover': '0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
