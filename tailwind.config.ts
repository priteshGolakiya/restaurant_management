import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      lavender: {
        50: '#f0f0ff',
        100: '#e6e6ff',
        200: '#ccccff',
        300: '#b3b3ff',
        400: '#9999ff',
        500: '#8080ff',
        600: '#6666ff',
        700: '#4d4dff',
        800: '#3333ff',
        900: '#1a1aff',
      },
    },
  },
  plugins: [],
};
export default config;
