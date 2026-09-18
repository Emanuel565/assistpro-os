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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc2fb',
          400: '#38a2f7',
          500: '#0071e3',
          600: '#0077ed',
          700: '#005bb5',
          800: '#004c99',
          900: '#003e7e',
          950: '#002552',
        },
        apple: {
          dark: '#000000',
          base: '#0d0d0f',
          card: '#161617',
          cardHover: '#1c1c1e',
          blue: '#0071e3',
          blueHover: '#0077ed',
          gray: '#86868b',
          light: '#f5f5f7'
        },
        navy: {
          800: '#202024',
          850: '#18181b',
          900: '#121214',
          950: '#000000',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
