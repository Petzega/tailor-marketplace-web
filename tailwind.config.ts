// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    // ... resto de tu config
    theme: {
        extend: {
            // ... tus extensiones existentes
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'subtle-zoom': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.05)' },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                'subtle-zoom': 'subtle-zoom 20s ease-in-out infinite alternate',
            },
        },
    },
    // ... plugins
};
export default config;