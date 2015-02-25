module.exports = {
    entry: "./index.js",
    output: {
        path: "build",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js/,   exclude: /node_modules/, loader: "jsx-loader!babel-loader" }
        ]
    }
};
