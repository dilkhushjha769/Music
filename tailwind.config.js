/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['Caveat', 'cursive'],
        script: ['Sacramento', 'cursive'],
        playful: ['"Dancing Script"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        romantic: {
          50: '#FFF5F7',
          100: '#FFE4E9',
          200: '#FFCCD6',
          300: '#FFA3B5',
          400: '#FF6B8B',
          500: '#FF4B72',
          600: '#E62248',
          700: '#C41E3A',
          800: '#9E152D',
          900: '#751022',
        }
      }
    },
  },
  plugins: [],
}
