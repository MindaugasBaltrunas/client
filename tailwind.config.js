/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      maxHeight: {
        lh: "600px", 
      },
      colors: {
        gray: {
          50: "oklch(0.985 0.000 0)",
          100: "oklch(0.961 0.000 0)",
          200: "oklch(0.922 0.000 0)",
          300: "oklch(0.875 0.000 0)",
          400: "oklch(0.735 0.000 0)",
          500: "oklch(0.631 0.000 0)",
          600: "oklch(0.522 0.000 0)",
          700: "oklch(0.427 0.000 0)",
          800: "oklch(0.279 0.000 0)",
          900: "oklch(0.156 0.000 0)",
          950: "oklch(0.078 0.000 0)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
