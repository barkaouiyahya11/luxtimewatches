import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
        allura: ['var(--font-allura)', 'cursive'],
      },
      colors: {
        gold: '#C5A059',
        'gold-light': '#d4b572',
      },
    },
  },
  plugins: [],
}

export default config
