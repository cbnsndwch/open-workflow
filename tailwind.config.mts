
import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can't use these anymore directly, now using CSS variables with bracket notation
      },
    },
  },
  plugins: [],
} satisfies Config;
