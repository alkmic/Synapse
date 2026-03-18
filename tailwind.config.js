/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SYNAPSE — MedVantis Pharma
        'al-blue': {
          50: '#E8EDF5',
          100: '#D1DBEB',
          200: '#A3B7D7',
          300: '#7593C3',
          400: '#476FAF',
          500: '#1B2A4A', // Primary — Bleu nuit
          600: '#162240',
          700: '#111A30',
          800: '#0C1220',
          900: '#070A10',
        },
        'al-navy': '#1B2A4A',
        'al-teal': '#2D6A4F',       // Vert médical
        'al-sky': '#40916C',         // Vert clair / accent
        // Aliases for backward compatibility
        airLiquide: {
          primary: '#1B2A4A',
          teal: '#2D6A4F',
          sky: '#40916C',
          navy: '#1B2A4A',
          lightBlue: '#E8EDF5',
          darkBlue: '#111A30',
        },
        // Semantic
        'success': '#2D6A4F',
        'warning': '#D4A843',
        'danger': '#C1553B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
