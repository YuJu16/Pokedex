/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Nymphalie Theme Palette
                background: "#FFF0F5", // Lavender Blush (Light Pink)
                foreground: "#5D4037", // Dark Brown (Softer than black)

                primary: {
                    DEFAULT: "#FF91A4", // Salmon Pink (Sylveon Pink)
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#88D1E6", // Sky Blue (Sylveon Blue)
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#FF91A4",
                },
                muted: {
                    DEFAULT: "#FFE4E1", // Misty Rose
                    foreground: "#8E7F7F",
                },
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#5D4037",
                },
                border: "#FFC0CB", // Pink

                // Pokemon Type Colors (Pastel versions)
                poke: {
                    red: '#FF6B6B',
                    blue: '#4ECDC4',
                    yellow: '#FFE66D',
                    white: '#F7FFF7',
                    darkRed: '#D63031',
                }
            },
            fontFamily: {
                sans: ['Quicksand', 'sans-serif'], // Rounder font
                display: ['Fredoka', 'sans-serif'], // Cute display font
            },
            backgroundImage: {
                'fairy-gradient': "linear-gradient(135deg, #FFF0F5 0%, #D4F1F4 100%)",
                'card-gradient': "linear-gradient(180deg, #FFFFFF 0%, #FFF0F5 100%)",
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(255,145,164,0.3)',
                'inner-glow': 'inset 0 0 20px rgba(255,255,255,0.8)',
            }
        },
    },
    plugins: [],
}
