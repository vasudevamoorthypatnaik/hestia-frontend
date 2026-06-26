/** @type {import('tailwindcss').Config} */
// HES-REDESIGN — Warm Hearth design system (designs/phase 1 v2).
// Material-style semantic tokens (Terracotta / Sage / Cream), each with a light value and a
// `-dark` counterpart for darkMode:'class'. Legacy HES-SETUP token names (terracotta, ink,
// surface, cream, field, sage, gold, danger) are KEPT as backward-compat ALIASES remapped to
// Warm Hearth values so untouched screens keep compiling + adopt the new palette (T5).
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  safelist: ['animate-float', 'animate-zoom-out'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ===== Warm Hearth semantic tokens (canonical) =====
        // Primary (terracotta). Dark keeps a terracotta fill for CTAs (brand-consistent) w/ white text.
        primary: { DEFAULT: '#9a4023', dark: '#c96342' },
        'primary-container': { DEFAULT: '#b95838', dark: '#b95838' },
        'on-primary': { DEFAULT: '#ffffff', dark: '#ffffff' },
        // Secondary (sage)
        secondary: { DEFAULT: '#456649', dark: '#abd0ac' },
        'secondary-container': { DEFAULT: '#c3e9c4', dark: '#2d4e33' },
        'on-secondary': { DEFAULT: '#ffffff', dark: '#01210a' },
        'on-secondary-container': { DEFAULT: '#496a4d', dark: '#c6ecc7' },
        // Surfaces (tonal layering)
        surface: { DEFAULT: '#fff8f5', light: '#fff8f5', dark: '#1a1714' },
        'surface-container-lowest': { DEFAULT: '#ffffff', dark: '#120f0d' },
        'surface-container-low': { DEFAULT: '#faf2ef', dark: '#231f1c' },
        'surface-container': { DEFAULT: '#f4ece9', dark: '#2a2521' },
        'surface-container-high': { DEFAULT: '#efe7e3', dark: '#352f2a' },
        'surface-container-highest': { DEFAULT: '#e9e1de', dark: '#403831' },
        'on-surface': { DEFAULT: '#1e1b19', dark: '#f7efec' },
        'on-surface-variant': { DEFAULT: '#56423d', dark: '#d8c3bb' },
        outline: { DEFAULT: '#89726b', dark: '#a08d86' },
        'outline-variant': { DEFAULT: '#dcc1b9', dark: '#4a3f3a' },
        'inverse-surface': { DEFAULT: '#33302e', dark: '#f7efec' },
        'inverse-on-surface': { DEFAULT: '#f7efec', dark: '#33302e' },
        // Error
        error: { DEFAULT: '#ba1a1a', dark: '#ffb4ab' },
        'on-error': { DEFAULT: '#ffffff', dark: '#690005' },
        'error-container': { DEFAULT: '#ffdad6', dark: '#5e1512' },
        'on-error-container': { DEFAULT: '#93000a', dark: '#ffdad6' },

        // ===== Backward-compat ALIASES (legacy HES-SETUP names → Warm Hearth values) =====
        terracotta: { DEFAULT: '#9a4023', dark: '#c96342', deep: '#7e2c10' },
        ink: { DEFAULT: '#1e1b19', dark: '#f7efec', muted: '#56423d', 'muted-dark': '#d8c3bb' },
        cream: { DEFAULT: '#faf2ef', dark: '#2a2521' },
        field: { DEFAULT: '#faf2ef', dark: '#231f1c', border: '#dcc1b9', 'border-dark': '#4a3f3a' },
        sage: { DEFAULT: '#456649', dark: '#abd0ac' },
        gold: { DEFAULT: '#B6843C', dark: '#CDA15E' },
        danger: { DEFAULT: '#ba1a1a', bg: '#ffdad6', border: '#f3c2b5' },
      },
      fontFamily: {
        // Warm Hearth: Quicksand (headlines) + Be Vietnam Pro (body). Legacy display/sans names
        // remapped to the new fonts so existing classNames adopt the new typography (A6).
        head: ['Quicksand', 'system-ui', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'system-ui', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
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
        glow: '0 0 40px 8px rgba(154,64,35,0.18)',
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
