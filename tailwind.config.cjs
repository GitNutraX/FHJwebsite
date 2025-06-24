/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // blue-500
        secondary: "#1E40AF", // blue-800
        accent: "#60A5FA", // blue-400
        neutral: "#4B5563", // gray-600
        'cta-orange': '#ff8c00', // Custom CTA orange color
      },
    },
  },
  plugins: [],
};