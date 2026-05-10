/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Nunito", "system-ui", "sans-serif"],
        hand: ["Gaegu", "cursive"],
      },
      colors: {
        cream: "#fff4d8",
        plum: "#5a365f",
        lavender: {
          100: "#f1e9ff",
          300: "#cab8ff",
          400: "#aa8cff",
          600: "#7d5bd6",
        },
      },
      boxShadow: {
        soft: "0 14px 35px rgba(129, 80, 141, 0.16)",
        dream: "0 22px 70px rgba(157, 92, 146, 0.24)",
        glow: "0 0 30px rgba(255, 117, 174, 0.55), 0 18px 45px rgba(174, 128, 255, 0.25)",
      },
    },
  },
  plugins: [],
};
