import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "!app/graphql/**/*",
    "!**/__generated__/**",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
