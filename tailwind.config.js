/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(36, 39%, 97%)",
        foreground: "hsl(25, 20%, 15%)",
        card: "hsl(33, 43%, 95%)",
        "card-foreground": "hsl(25, 20%, 15%)",
        popover: "hsl(33, 43%, 95%)",
        "popover-foreground": "hsl(25, 20%, 15%)",
        primary: "hsl(25, 40%, 25%)",
        "primary-foreground": "hsl(36, 39%, 97%)",
        secondary: "hsl(33, 25%, 88%)",
        "secondary-foreground": "hsl(25, 20%, 15%)",
        muted: "hsl(33, 25%, 92%)",
        "muted-foreground": "hsl(25, 15%, 45%)",
        accent: "hsl(38, 70%, 55%)",
        "accent-foreground": "hsl(25, 20%, 15%)",
        destructive: "hsl(0, 84.2%, 60.2%)",
        "destructive-foreground": "hsl(36, 39%, 97%)",
        border: "hsl(33, 25%, 85%)",
        input: "hsl(33, 25%, 85%)",
        ring: "hsl(25, 40%, 25%)",
      },
    },
  },
  plugins: [],
}