/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  // Safelist animation utilities referenced via inline animationName in StyleSheet.create
  // (Tailwind JIT only emits @keyframes when a class appears in scanned templates)
  safelist: ['animate-float', 'animate-zoom-out'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
        },
        surface: {
          light: '#fafbfc',
          dark: '#0f172a',
        },
        nav: {
          'active-bg': '#f5f3ff',
          'active-bg-dark': 'rgba(139, 92, 246, 0.15)',
          'active-text': '#7c3aed',
          'active-text-dark': '#a78bfa',
          'inactive-text': '#6b7280',
          'inactive-text-dark': '#9ca3af',
          'border': '#e5e7eb',
          'border-dark': '#374151',
        },
        sidebar: {
          'active-bg': '#f5f3ff',
          'active-bg-dark': 'rgba(139, 92, 246, 0.15)',
          'active-border': '#8b5cf6',
          'bg': '#f9fafb',
          'bg-dark': '#1f2937',
        },
      },
      fontFamily: {
        display: ['DMSerifDisplay', 'Georgia', 'serif'],
        sans: ['DMSans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'button': '10px',
        'input': '10px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      },
      // Web-only animation keyframes (NativeWind ignores these on native)
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'zoom-out': {
          '0%': { opacity: '0', transform: 'scale(2.0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'spring-pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'zoom-out': 'zoom-out 2.5s ease-out forwards',
        'spring-pop': 'spring-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        shimmer: 'shimmer 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
