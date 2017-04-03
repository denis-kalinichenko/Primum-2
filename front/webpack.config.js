const path = require("path");

module.exports = {
    devtool: "source-map",
    entry: "./front/lib/front.js",
    output: {
        path: path.resolve("./front/dist"),
        filename: "bundle.js",
        publicPath: "/dist/",
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ["babel-loader?cacheDirectory"],
                exclude: path.resolve(__dirname, "node_modules/"),
            },
        ]
    },
    devServer: {
        inline: true,
        historyApiFallback: true,
        port: 3001,
        host: "localhost",
        contentBase: "./front",
        hot: false,
        stats: {
            colors: true,
        },
    },
};