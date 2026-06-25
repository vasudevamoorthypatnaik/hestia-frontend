/** @type {import('tailwindcss').Config} */
// Phase 1 design tokens (HES-SETUP) — warm "household" palette from designs/phase-1.
// Semantic names; each color exposes light + dark variants for darkMode:'class'.
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  safelist: ['animate-float', 'animate-zoom-out'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand accent (terracotta)
        terracotta: {
          DEFAULT: '#C4603D',
          dark: '#D08C70',
          deep: '#A0492C',
        },
        // Text / ink
        ink: {
          DEFAULT: '#2B2521',
          dark: '#F4EFE6',
          muted: '#6B6155',
          'muted-dark': '#A89A88',
        },
        // Backgrounds & surfaces
        surface: {
          light: '#E9E2D6',
          dark: '#1F1B18',
        },
        cream: {
          DEFAULT: '#EFE7DA',
          dark: '#3A332C',
        },
        field: {
          DEFAULT: '#F8F4EC',
          dark: '#2B2521',
          border: '#E0D5C5',
          'border-dark': '#4A4238',
        },
        // Status accents
        sage: { DEFAULT: '#6E9466', dark: '#8FB587' },
        gold: { DEFAULT: '#B6843C', dark: '#CDA15E' },
        danger: { DEFAULT: '#A0492C', bg: '#FBEAE2', border: '#E2A88E' },
      },
      fontFamily: {
        // Newsreader (serif/display) + Hanken Grotesk (sans/body) per Phase 1 design
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['HankenGrotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        button: '12px',
        input: '12px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(43,37,33,0.08), 0 1px 2px -1px rgba(43,37,33,0.06)',
        elevated: '0 30px 60px -20px rgba(43,37,33,0.45)',
      },
      keyframes: {
        'zoom-out': {
          '0%': { opacity: '0', transform: 'scale(2.0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'zoom-out': 'zoom-out 2.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        spin: 'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}
