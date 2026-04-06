/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
<<<<<<< HEAD
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0a',
        card: '#18181b',
        primary: '#10b981',
        secondary: '#0ea5e9',
=======
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        background: '#090a0f',
        panel: '#10141d',
        card: '#161b22',
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          900: '#134e4a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
>>>>>>> ddc30ed (final clean code for deployment)
      }
    },
  },
  plugins: [],
}
