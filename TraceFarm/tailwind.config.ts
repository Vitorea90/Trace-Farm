import type { Config } from "tailwindcss";


const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Agricultural/Modern palette
                background: "rgb(var(--background-end-rgb))",
                foreground: "rgb(var(--foreground-rgb))",
                card: "rgb(var(--card-rgb))",
                "card-foreground": "rgb(var(--card-foreground-rgb))",
                border: "rgb(var(--border-rgb))",
                input: "rgb(var(--input-rgb))",
                ring: "rgb(var(--ring-rgb))",
                "muted-foreground": "rgb(var(--muted-foreground-rgb))",
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e', // brand brand
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                earth: {
                    50: '#fdf8f6',
                    100: '#f2e8e5',
                    200: '#eaddd5',
                    800: '#5e4c43',
                    900: '#4a3b35',
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
