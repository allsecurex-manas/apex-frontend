/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-white',
    'bg-gray-50',
    'from-blue-50',
    'to-indigo-50',
    'from-blue-600',
    'to-indigo-700',
    'text-transparent',
    'bg-clip-text',
  ],
  theme: {
    extend: {
      animation: {
        'progress': 'progress 2.5s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        progress: {
          '0%': { width: '0%', background: '#60A5FA' },
          '50%': { width: '70%', background: '#3B82F6' },
          '100%': { width: '100%', background: '#2563EB' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
