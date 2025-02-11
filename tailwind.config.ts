import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      'heading1-bold': ["50px", { lineHeight: "100%", fontWeight: "700" }],
      'heading2-bold': ["30px", { lineHeight: "100%", fontWeight: "700" }],
      'heading3-bold': ["24px", { lineHeight: "100%", fontWeight: "700" }],
      'heading4-bold': ["20px", { lineHeight: "100%", fontWeight: "700" }],
      'body-bold': ["18px", { lineHeight: "100%", fontWeight: "700" }],
      'body-semibold': ["18px", { lineHeight: "100%", fontWeight: "600" }],
      'body-medium': ["18px", { lineHeight: "100%", fontWeight: "500" }],
      'base-bold': ["16px", { lineHeight: "100%", fontWeight: "600" }],
      'base-medium': ["16px", { lineHeight: "100%", fontWeight: "500" }],
      'small-bold': ["14px", { lineHeight: "140%", fontWeight: "700" }],
      'small-medium': ["14px", { lineHeight: "140%", fontWeight: "500" }]
    },
    extend: {
      colors: {
        'red-1': '#FF0000',
        'grey-1': '#F7F7F7',
        'grey-2': '#8A8A8A',
        brown: {
          DEFAULT: '#8B4513',
          light: '#D2B48C',
          dark: '#654321',
        },
        
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate")
  ],
};

export default config;
