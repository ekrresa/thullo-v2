/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#dbeefe',
          200: '#bfe2fe',
          300: '#93d1fd',
          400: '#60b7fa',
          500: '#3b98f6',
          600: '#2f80ec',
          700: '#1d64d8',
          800: '#1e51af',
          900: '#1e468a',
        },
        roman: {
          50: '#fdf3f3',
          100: '#fbe8e8',
          200: '#f7d4d5',
          300: '#f1b0b3',
          400: '#e8848b',
          500: '#db5461',
          600: '#c7374c',
          700: '#a7293f',
          800: '#8c2539',
          900: '#782337',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      gridTemplateRows: {
        layout: 'auto 1fr auto',
        stack: 'repeat(auto-fit, minmax(min(14rem, 100%), 1fr))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
