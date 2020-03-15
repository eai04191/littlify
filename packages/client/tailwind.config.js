module.exports = {
    theme: {
        darkSelector: ".theme-dark",
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
        },
    },
    variants: {
        backgroundColor: [
            "responsive",
            "hover",
            "focus",
            "dark",
            "dark-hover",
            "dark-group-hover",
            "group-hover",
        ],
        borderColor: [
            "responsive",
            "hover",
            "focus",
            "dark",
            "dark-focus",
            "dark-focus-within",
        ],
        display: ["responsive", "dark", "dark-hover", "dark-active"],
        textColor: [
            "responsive",
            "hover",
            "focus",
            "dark",
            "dark-hover",
            "dark-active",
            "group-hover",
        ],
        textDecoration: ["responsive", "hover", "focus", "dark", "dark-hover"],
    },
    plugins: [require("tailwindcss-dark-mode")()]
};
