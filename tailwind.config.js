/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Changed from "media" to "class"
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        accent: "#3b82f6"
      },
      boxShadow: { 
        soft: "0 4px 12px rgba(0,0,0,0.04)" // A softer shadow
      }
    }
  },
  plugins: []
};