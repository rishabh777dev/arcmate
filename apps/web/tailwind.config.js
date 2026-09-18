/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Tight"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        paytm: {
          dark: '#002970',
          blue: '#004085',
          cyan: '#00BAF2',
          light: '#EBF8FF'
        },
        paper: {
          DEFAULT: '#0e0d0a',
          warm: '#161410',
          dark: '#23201c',
          bone: '#1e1c18',
        },
        ink: {
          DEFAULT: '#f2ebd8',
          soft: '#c8c0a8',
          mute: '#9a9382',
          faint: '#6e6860',
        },
        coral: {
          DEFAULT: '#ed6f5c',
          soft: '#f08e7c',
          hover: '#e25e4a',
        },
        mustard: '#e9b94a',
        olive: '#6e7448',
      }
    },
  },
  plugins: [],
}
