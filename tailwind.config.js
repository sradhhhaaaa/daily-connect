/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F4E45",
          hover: "#183F38",
          light: "#2B6B5E",
          bg: "#EAF3F0",
        },
        accent: {
          DEFAULT: "#E8A33D",
          hover: "#D6922C",
          light: "#FDF6EA",
        },
        bg: {
          light: "#F7F7F5",
          white: "#FFFFFF",
        },
        text: {
          primary: "#2A2A2A",
          secondary: "#8A8F8C",
        },
        status: {
          available: "#10B981",
          unavailable: "#EF4444",
          pending: "#F59E0B",
        }
      },
    },
  },
  plugins: [],
};
