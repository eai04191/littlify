module.exports = {
    theme: {
        screens: {
            "dark-mode": {
                raw: "(prefers-color-scheme: dark)"
            }
        },
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
            }
        }
    },
    plugins: [require("tailwindcss-dark-mode")()]
};
