module.exports = {
    plugins: [
        require("tailwindcss")("./tailwind.config.js"),
        require("autoprefixer"),
        require("@fullhuman/postcss-purgecss")({
            content: [
                "./index.html",
                "./src/**/*.css",
                "./src/**/*.ts",
                "./src/**/*.tsx"
            ],
            whitelistPatternsChildren: [
                /.*theme-dark.*/,
            ],
        }),
    ]
};
