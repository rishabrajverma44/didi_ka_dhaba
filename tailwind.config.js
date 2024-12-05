/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontSize: {
        xs: "0.7rem",
        sm: "0.875rem",
      },
      textColor: {
        DEFAULT: "rgb(71 85 105)",
      },
      colors: {
        btn: {
          primary: "#A24C4A",
          hoverPrimary: "#752F21",
          hoverPrimaryText: "#ffffff",
          secondary: "#ffffff",
          hoverSecondary: "#53230A",
          hoverSecondaryText: "#ffffff",
        },
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
