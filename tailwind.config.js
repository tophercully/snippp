/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        online: {
          "0%, 100%": { border: "transparent" },
          "50%": { borderColor: "#16a34a" },
        },
      },
      animation: {
        online: "online 1s ease-in-out infinite",
      },
      colors: {
        base: {
          DEFAULT: "#767676",
          50: "#FFFFFF",
          100: "#FAFAFA",
          150: "#eeeeee",
          200: "#D9D9D9",
          300: "#B8B8B8",
          400: "#979797",
          500: "#767676",
          600: "#5C5C5C",
          700: "#434343",
          800: "#292929",
          850: "#181818",
          900: "#101010",
          950: "#030303",
        },
        error: "#dc2626",
        success: "#16a34a",
        info: "#1d4ed8",
        special: "#7e22ce",
      },
      fontFamily: {
        satoshi: [
          "Satoshi",
          "Roboto",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
};
