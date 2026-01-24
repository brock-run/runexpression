import type { Config } from 'tailwindcss'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import tailwindAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
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
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // RunExpression brand colors (will be customized per brand guide)
        'run-black': '#1a1a1a',
        'run-white': '#fafafa',
        'run-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // RunExpression brand colors from CSS variables
        run: {
          primary: {
            50: 'hsl(var(--run-primary-50))',
            100: 'hsl(var(--run-primary-100))',
            200: 'hsl(var(--run-primary-200))',
            300: 'hsl(var(--run-primary-300))',
            400: 'hsl(var(--run-primary-400))',
            500: 'hsl(var(--run-primary-500))',
            600: 'hsl(var(--run-primary-600))',
            700: 'hsl(var(--run-primary-700))',
            800: 'hsl(var(--run-primary-800))',
            900: 'hsl(var(--run-primary-900))',
          },
          accent: {
            50: 'hsl(var(--run-accent-50))',
            100: 'hsl(var(--run-accent-100))',
            200: 'hsl(var(--run-accent-200))',
            300: 'hsl(var(--run-accent-300))',
            400: 'hsl(var(--run-accent-400))',
            500: 'hsl(var(--run-accent-500))',
            600: 'hsl(var(--run-accent-600))',
            700: 'hsl(var(--run-accent-700))',
            800: 'hsl(var(--run-accent-800))',
            900: 'hsl(var(--run-accent-900))',
          },
          neutral: {
            0: 'hsl(var(--run-neutral-0))',
            50: 'hsl(var(--run-neutral-50))',
            100: 'hsl(var(--run-neutral-100))',
            200: 'hsl(var(--run-neutral-200))',
            300: 'hsl(var(--run-neutral-300))',
            400: 'hsl(var(--run-neutral-400))',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        // RunExpression brand animations
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(147, 102, 153, 0.4), 0 0 40px rgba(147, 102, 153, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(147, 102, 153, 0.6), 0 0 60px rgba(147, 102, 153, 0.2)'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        // RunExpression brand animations
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [tailwindAnimate],
}

export default config
