const path = require("path");

module.exports = {
    devtool: "inline-source-map",
    mode: "production",
    entry: "./src/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            // {
            //     test: /.js$/,
            //     exclude: /(node_modules|bower_components)/,
            //     use: {
            //         loader: "babel-loader",
            //         options: {
            //             presets: ["@babel/preset-env"],
            //         },
            //     },
            // },
            {
                test: /\.handlebars$/, loader: "handlebars-loader",
            },
        ],
    },
};
