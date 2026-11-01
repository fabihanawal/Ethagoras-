/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ether: {
          green: '#2c5f2d',
          darkgreen: '#1f4420',
          lightgreen: '#3c7a3d',
          gold: '#ffd700',
          darkgold: '#d4af37',
          lightgold: '#fff280',
          cream: '#fbfdf9',
        },
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        'custom-lg': '3rem',
        'custom-xl': '4rem',
      },
    },
  },
  plugins: [],
};
