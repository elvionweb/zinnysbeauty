/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#170e13',
        plum: '#2a1620',
        cream: '#fbf3f0',
        blush: '#f6d9de',
        rose: { DEFAULT: '#c9456f', soft: '#e58aa8' },
        gold: '#c79a68',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        spin360: { to: { transform: 'rotate(360deg)' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '.5' }, '100%': { transform: 'scale(1.8)', opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        spinSlow: 'spin360 18s linear infinite',
        pulseRing: 'pulseRing 2.2s ease-out infinite',
      },
    },
  },
  plugins: [],
}
