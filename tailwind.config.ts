import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },

            animation: {
                'show-message': 'show-message 5s forwards',
            },

            keyframes: {
                'show-message': {
                    '0%': {
                        transform: 'translateX(-120%)',
                        opacity: '0',
                    },
                    '10%': {
                        transform: 'translateX(0%)',
                        opacity: '1',
                    },
                    '90%': {
                        transform: 'translateX(0%)',
                        opacity: '1',
                    },
                    '100%': {
                        transform: 'translateX(-120%)',
                        opacity: '0',
                    },
                },
            },
        },
    },
    plugins: [],
}
export default config
