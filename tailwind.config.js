/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
        extraBold: 800,
      },
      colors: {
        greyMetal: "#888E8F",
        pink1: "#B054FF",
        pink2: "#AF54FF",
        blackDreamless: "#101010",
      },
    },
    fontSize: {
      xs: ["10px"],
      sm: ["12px", "19px"],
      base: ["14px", "22px"],
      lg: ["16px"],
      xl: ["18px"],
      "2xl": ["20px"],
      "3xl": ["22px"],
      "4xl": ["24px"],
      "5xl": ["26px"],
      "6xl": ["28px"],
      "7xl": ["30px"],
      "8xl": ["32px"],
    },
  },
  plugins: [],
  prefix: "tw-",
};
