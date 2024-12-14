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
        'vasek': ['Vasek', 'cursive']
      },
      colors: {
        primary: {
          700: '#c9ac67',
          DEFAULT: '#c9ac67'
        },
        accent: {
          DEFAULT: '#f6cb66'
        }
      }
    },
  },
  plugins: [],
}

