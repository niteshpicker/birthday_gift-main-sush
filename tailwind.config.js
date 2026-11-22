/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['"Patrick Hand"', '"Caveat"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        plum: '#2D192B',
        roseAccent: '#E12D53',
        blushBg: '#FCEEE9',
        creamPaper: '#FFFDF9',
      },
    },
  },
  plugins: [],
}
