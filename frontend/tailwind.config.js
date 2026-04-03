/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0A0A0F',
          900: '#0F0F18',
          800: '#16161F',
          700: '#1E1E2A',
          600: '#272735',
          500: '#323240',
          400: '#4A4A5E',
          300: '#6B6B82',
          200: '#9191A8',
          100: '#C4C4D4',
          50:  '#EEEEF4',
        },
        amber: {
          DEFAULT: '#F5A623',
          dim:    '#C4831A',
          glow:   '#FFD180',
          muted:  '#8C5E10',
          deep:   '#3D2A06',
        },
        teal: {
          DEFAULT: '#2ECAA0',
          dim:    '#1D8A6E',
          muted:  '#0D4035',
        },
        coral: {
          DEFAULT: '#FF5C5C',
          dim:    '#CC3333',
          muted:  '#4A1515',
        },
      },
    }
  },
  plugins: []
}
