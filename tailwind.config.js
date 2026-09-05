/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#1B2430',
        mist: '#F4F7F6',
        sky: '#7FA7C4',
        sage: '#8FAE95',
        lavender: '#B2A6D6',
        sand: '#E9E2D6',
        alert: '#C4635A',
        brand: {
          50: '#f0f6fa',
          100: '#e1edf5',
          200: '#c3dbeb',
          300: '#a5c9e1',
          400: '#87b7d7',
          500: '#7FA7C4',
          600: '#5a8baa',
          700: '#436c86',
          800: '#2d4d62',
          900: '#1B2430',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Newsreader"', '"Fraunces"', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 16s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.25)' },
          '50%': { transform: 'scale(1.25)' },
          '75%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
