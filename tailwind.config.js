/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "custom-green": "#09FE61",
        "custom-blue": "#4303FF",
      },
      textColor: {
        "custom-green": "#09FE61",
      },
    },
  },
  plugins: [],
};
