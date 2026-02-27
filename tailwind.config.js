/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        paper: '#FDFCF0',
        ink: '#1A1A1A',
        'background-light': '#FDFCF0',
        'background-dark': '#111621',
        surface: 'var(--surface)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};
