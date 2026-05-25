import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        charcoal: '#1a1a1a',
        graphite: '#2a2a2a',
        bone: '#f6f5f1',
        stone: '#a8a29e',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'display': '0.22em',
        'editorial': '0.32em',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
