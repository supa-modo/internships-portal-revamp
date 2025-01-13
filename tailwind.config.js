module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      fontFamily: {
        "nunito-sans": ['"Nunito Sans"', "sans-serif"],
        "open-sans": ['"Open Sans"', "sans-serif"],
        geist: ['"Geist"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
