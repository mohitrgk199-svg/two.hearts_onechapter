/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff5f7',
          100: '#ffe4ec',
          200: '#ffc9db',
          300: '#ffa3c0',
          400: '#ff7aa6',
          500: '#f85a8c',
          600: '#e23f73',
          700: '#bb2a5b',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        plum: {
          900: '#2a1a3d',
          800: '#3d2456',
          700: '#52306e',
          600: '#6b3e8a',
        },
        navy: {
          900: '#1a1325',
          800: '#241a33',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-up': 'floatUp linear infinite',
        'float-side': 'floatSide ease-in-out infinite',
        'twinkle': 'twinkle ease-in-out infinite',
        'glow-pulse': 'glowPulse ease-in-out infinite',
        'soft-rotate': 'softRotate ease-in-out infinite',
        'fade-in': 'fadeIn ease forwards',
        'fade-in-up': 'fadeInUp ease forwards',
        'fade-out': 'fadeOut ease forwards',
        'scale-in': 'scaleIn ease forwards',
        'shimmer': 'shimmer linear infinite',
        'breathe': 'breathe ease-in-out infinite',
        'drift': 'drift ease-in-out infinite',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(100vh) scale(0.6) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '90%': { opacity: '0.7' },
          '100%': { transform: 'translateY(-10vh) scale(1) rotate(15deg)', opacity: '0' },
        },
        floatSide: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(30px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(8px)' },
          '50%': { opacity: '1', filter: 'blur(12px)' },
        },
        softRotate: {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        drift: {
          '0%': { transform: 'translateX(-10vw) translateY(0)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.5' },
          '100%': { transform: 'translateX(110vw) translateY(-20px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
