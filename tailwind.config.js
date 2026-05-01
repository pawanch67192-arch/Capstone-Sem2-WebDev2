/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
      },
      colors: {
        quest: {
          50: '#f0fdf9',
          100: '#ccfbef',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        xp: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: '#ef4444',
        rare: '#8b5cf6',
        epic: '#ec4899',
        legendary: '#f97316',
      },
      animation: {
        'xp-float': 'xpFloat 1.2s ease-out forwards',
        'badge-pop': 'badgePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'level-up': 'levelUp 0.8s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'streak-glow': 'streakGlow 2s ease-in-out infinite',
      },
      keyframes: {
        xpFloat: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-80px) scale(1.3)' },
        },
        badgePop: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(16,185,129,0.7)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 20px rgba(16,185,129,0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(16,185,129,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        streakGlow: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(251,191,36,0.4)' },
          '50%': { boxShadow: '0 0 20px 6px rgba(251,191,36,0.8)' },
        },
      },
    },
  },
  plugins: [],
}
