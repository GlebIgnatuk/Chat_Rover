/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: 'hsl(26, 81%, 94%)',
          700: 'hsl(45, 65%, 62%)',
          DEFAULT: 'hsl(45, 65%, 62%)'
        },
        gray: {
          100: '',
          200: '',
          300: 'hsl(60, 1%, 57%)',
          400: '',
          500: 'hsl(140, 4%, 32%)',
          600: '',
          700: 'hsl(60, 3%, 8%)',
          800: '',
          900: '',
          950: '',
          DEFAULT: 'hsl(60, 3%, 8%)'
        }
      }
    },
  },
  plugins: [],
}

