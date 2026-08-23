/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5C32E6',
          light: '#7A5AF0',
          dark: '#4522B8',
        },
        slate: {
          50: '#F8F9FA',
          100: '#F1F3F5',
        }
      },
      animation: {
        'glow-flicker': 'glow-flicker 2s infinite alternate',
      },
      keyframes: {
        'glow-flicker': {
          '0%, 100%': { 
            boxShadow: '0 0 10px #25D366, 0 0 20px #25D366',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 20px #25D366, 0 0 30px #25D366, 0 0 40px #25D366',
            transform: 'scale(1.05)'
          },
        }
      }
    },
  },
  plugins: [],
}
