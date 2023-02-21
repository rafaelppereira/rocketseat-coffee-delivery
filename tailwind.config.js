/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          100: "#EBE5F9",
          500: "#8047F8",
        },

        yellow: {
          100: "#F1E9C9",
          500: "#DBAC2C",
          700: "#C47F17",
        },

        gray: {
          50: "#EDEDED",
          100: "#F3F2F2",
          200: "#E6E5E5",
          300: "#8D8686",
          800: "#272221",
        },

        brow: {
          300: "#574F4D",
          400: "#403937",
        },
      },

      fontFamily: {
        roboto: "Roboto",
        baloo: "Baloo 2",
      },

      backgroundImage: {
        banner: "url(/background-banner.png)",
      },
    },
  },
  plugins: [],
};
