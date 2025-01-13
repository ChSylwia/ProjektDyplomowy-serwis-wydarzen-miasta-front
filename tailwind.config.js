/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        primary: '#0077c0',
        secondary: '#6cb4ee',
        tertiary: '#F0F8FF'
      }
    }
  },
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui'), require('tailwindcss-animate')],
  daisyui: {
    themes: ['nord']
  }
}
