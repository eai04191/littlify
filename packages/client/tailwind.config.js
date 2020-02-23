module.exports = {
    theme: {
        extend: {
            maxWidth: {
                "screen-1/2": "50vw"
            },
            maxHeight: {
                "screen-w-1/2": "50vw"
            },
            colors: {
                "spotify-green": "#1db954",
                "spotify-green-light": "#1ed760"
            },
            screens: {
                "dark-mode": {
                    raw: "(prefers-color-scheme: dark)"
                }
            }
        }
    },
    plugins: [require("tailwindcss-dark-mode")()]
};
