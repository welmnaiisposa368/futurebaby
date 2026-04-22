import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'baby-blue': '#E3F2FD',
        'baby-pink': '#FCE4EC',
        'soft-cream': '#FFF8E1',
      },
      fontFamily: {
        'rounded': ['ui-rounded', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
