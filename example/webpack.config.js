module.exports = {
  entry: {
    app:  './index.jsx'
  },
  output: {
    filename: "bundle.js"
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.js(x?)/,   exclude: /node_modules/, loader: "jsx-loader!babel-loader" }
    ]
  },
};
