module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./helpers/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1.5s infinite",
        spin: "spin 2s linear infinite",
        ping: "ping 1s cubic-bezier(1, 1, 0.2, 0) 0.5s",
      },
      keyframes: {
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: ".5",
          },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(0%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(15%)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        spin: {
          to: {
            transform: "rotate(360deg)",
          },
        },
        ping: {
          "75%, 100%": {
            transform: "scale(1)",
            opacity: "0",
          },
        },
      },
    },
    screens: {
      sm: { max: "640px" },
      // => @media (max-width: 640px) { ... }

      md: { max: "768px" },
      // => @media (max-width: 768px) { ... }

      lg: { max: "1024px" },
      // => @media (max-width: 1024px) { ... }

      xl: { max: "1280px" },
      // => @media (max-width: 1280px) { ... }

      "2xl": { max: "1536px" },
      // => @media (max-width: 1536px) { ... }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
