const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const extractPlugin = new MiniCssExtractPlugin({
    filename: "styles.css",
});

module.exports = {
    mode: "production",
    entry: "./src/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    },
                },
            },
        ],
    },
    plugins: [
        extractPlugin,
    ],
};
