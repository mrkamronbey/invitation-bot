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
        // Gilroy — default. Fayl bo'lmasa tizim shriftiga tushadi.
        sans: ['Gilroy', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Sarlavhalar uchun ixtiyoriy nafis serif
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
