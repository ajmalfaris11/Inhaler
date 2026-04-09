/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#0a0a0a",
        "surface-hover": "#121212",
        accent: {
          start: "#0082ff",
          end: "#00ffd5",
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))',
      }
    },
  },
  plugins: [],
};
