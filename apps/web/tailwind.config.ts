import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Nafis to'y palitrasi (yaxshi kontrast bilan)
        cream: '#faf7f2', // asosiy fon
        ink: '#28211b', // matn (to'qroq — o'qilishi yaxshi)
        gold: '#b08d57', // urg'u (nozik oltin ramka)
        blush: '#e6d3bf', // chegara/yumshoq
        night: '#1c1814', // to'q fon (Modern shablon)
        sage: '#8ea67f', // eukalipt bargi (yashil)
        'sage-dark': '#6f8663', // to'q barg
        rose: '#efe3d8', // atirgul rangi (krem-pushti)
        emerald: '#0f3d2e', // zumrad (Emerald shablon foni)
        'emerald-deep': '#082019', // eng to'q zumrad
        'gold-light': '#d8bd82', // yorqinroq oltin (to'q fon uchun)
        ivory: '#f4efe3', // fil suyagi (to'q fonda matn)

        // shadcn/ui tokenlari (CSS o'zgaruvchilar — globals.css'da; sayt UI uchun)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
  plugins: [tailwindcssAnimate],
};

export default config;
