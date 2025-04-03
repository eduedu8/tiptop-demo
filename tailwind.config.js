/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Ensure all your app files are scanned
  theme: {
    extend: {
      colors: {
        background: "#FFFDED", // Background color
        textColor: "#552B1B",  // Body text color
        accent: "#AA94E2",     // Titles & Buttons color
      },
      fontFamily: {
        sans: ['"Work Sans"', "sans-serif"],  // Body & inputs font
        title: ['"Fahkwang"', "sans-serif"],   // Titles & buttons font
      },
    },
  },
  plugins: [],
};
