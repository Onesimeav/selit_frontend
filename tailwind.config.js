/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        poppins:['poppins', 'sans-serif'],
      },
      fontSize: {
        'normal-text':'14px',
        'heading-3':'18px',
        'heading-2':'22px',
        'heading-1':'28px',
      },
      fontWeight: {
        'extra-bold': 800,
        'black': 900,
        'bold':700,
        'semibold': 600,
        'medium':500,
        'regular':400,
        'light':300,
        'extralight':200,
        'thin':100,
      },
      colors: {
        appBlack: '#2A2A2A',
        appGray:'#C7CACF',
        appBlue:'#0066FFFF',
        appYellow:'#FBBC05FF'
      },
      maxWidth: {
        '5/12': '41.666667%',
      }
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('flowbite/plugin')
  ],
}

