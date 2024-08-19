import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'max': '1880px' 
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      dropShadow: {
        'glow': '0px 0px 100px 100px #fff',
      },
      colors: {
        secondary: 'rgb(255, 255, 255)'
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite'
      },
      maxHeight: {
        'searchPopUp': '45rem',
      }
    },
  },
  plugins: [],
};
export default config;
