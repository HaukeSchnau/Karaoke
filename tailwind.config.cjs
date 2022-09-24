/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: [
        "Montserrat",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif",
      ],
    },
    colors: {
      white: "#fff",
      black: "#222",
      gray: "rgba(0, 0, 0, 0.6)",
      "overlay-black": "rgba(0,0,0,0.1)",
    },
  },
  plugins: [],
};
