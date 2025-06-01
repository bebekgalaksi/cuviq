/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};

module.exports = {
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 2s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
};
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
};