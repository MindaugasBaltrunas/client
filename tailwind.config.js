module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      maxHeight: {
        lh: "600px", 
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
