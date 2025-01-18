/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        'pulse-25-50': 'pulse-25-50 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        tangerine: ['Tangerine', 'cursive'],
        'vasek': ['Vasek', 'cursive'],
        'exo2': ['"Exo 2"', 'sans-serif'],
        'great-vibes': ['"Great Vibes"', 'serif'],
      },
      colors: {
        primary: {
          700: '#EEC550',
          DEFAULT: '#EEC550'
        },
        stone: {
          800: '#1D1919',
        },
        accent: {
          DEFAULT: '#f6cb66'
        }
      }
    },
  },
  plugins: [],
}

