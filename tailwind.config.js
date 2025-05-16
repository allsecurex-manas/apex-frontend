/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'progress': 'progress 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        progress: {
          '0%': { width: '0%', background: '#60A5FA' },
          '50%': { width: '70%', background: '#3B82F6' },
          '100%': { width: '100%', background: '#2563EB' },
        },
      },
    },
  },
  plugins: [],
}
