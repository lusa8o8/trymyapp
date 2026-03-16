import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0F172A',
          dark: '#0A0F1E',
        },
        surface: {
          white: '#FFFFFF',
          muted: '#F8FAFC',
          border: '#E2E8F0',
        },
        text: {
          primary: '#0F172A',
          secondary: '#4B5563',
          faint: '#94A3B8',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.07)',
        hover: '0 8px 30px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
