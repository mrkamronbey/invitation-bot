import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Nafis to'y palitrasi (yaxshi kontrast bilan)
        cream: '#faf7f2', // asosiy fon
        ink: '#28211b', // matn (to'qroq — o'qilishi yaxshi)
        gold: '#a9814f', // urg'u (chuqurroq oltin — kontrast uchun)
        blush: '#e6d3bf', // chegara/yumshoq
        night: '#1c1814', // to'q fon (Modern shablon)
      },
      fontFamily: {
        // Gilroy — default (tana, UI). Fayl bo'lmasa tizim shriftiga tushadi.
        sans: ['Gilroy', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Cormorant Garamond — nafis serif (ismlar, katta sarlavhalar).
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'draw-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out both',
        'fade-in': 'fade-in 1.2s ease-out both',
        float: 'float 4s ease-in-out infinite',
        'draw-in': 'draw-in 1s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
