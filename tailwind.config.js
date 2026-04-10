/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0e27',
          darker: '#060816',
          accent: '#00ff41',
          accentDim: '#00cc33',
          text: '#e0e0e0',
          textDim: '#a0a0a0',
          border: '#1a1f3a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 8s linear infinite',
        'type': 'type 2s steps(40, end)',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41' },
          '100%': { boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        type: {
          'from': { width: '0' },
        },
      },
    },
  },
  plugins: [],
}
