/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { forest: '#166534', leaf: '#22c55e', ink: '#102a43', mist: '#f5fbf7', sky: '#2563eb' },
      boxShadow: { soft: '0 18px 50px rgba(21, 74, 45, 0.10)', glow: '0 10px 35px rgba(34, 197, 94, 0.18)' },
    },
  },
  plugins: [],
}
