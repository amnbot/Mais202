/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/src/**/*.js"
  ],
  theme: {
    colors: {
      'background': '#25233b',
      'default-text': '#fefbff',
      'button': ['#7a18fb']
    },
    extend: {},
  },
  plugins: [],
}