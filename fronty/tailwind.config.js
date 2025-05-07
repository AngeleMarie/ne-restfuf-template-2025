/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-out-right': 'slideOutRight 0.4s ease-in forwards',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
      },
      colors:{
        'main-black':'#1B212D',
        'main-green':'#C8EE44',
        'main-grey':'#FAFAFA',
        'main-blue':'#4460EE',
        'random-grey':'#929EAE'
      },
      keyframes: {
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-50px)' },
        },
        bounceX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(30px)' },
        },
      },
      animation: {
        bounceY: 'bounceY 1s infinite ease-in-out',
        bounceX: 'bounceX 1s infinite ease-in-out',
      }
    },
  },
  plugins: [

  ],
}