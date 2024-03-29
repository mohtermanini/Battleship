const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // mode: "development",
    mode: "production",
    entry: "./src/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        clean: true
    },
    // devServer: {
    //     static: {
    //         directory: path.join(__dirname, '/dist')
    //     }
    // },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.handlebars$/, loader: "handlebars-loader",
                options: {
                    knownHelpersOnly: false,
                    inlineRequires: '\/assets\/'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", "css-loader", "sass-loader"
                ],
            },
            {
                test: /\.(svg|wav|mp3)$/,
                type: 'asset/resource'
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
            favicon: "./favicon.png"
        })
    ]
};
