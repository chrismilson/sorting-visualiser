module.exports = {
  module: {
    rules: [
      {
        // any files anding in mjs, js, or jsx will be piped through the
        // babel-loader.
        test: /\.(mjs|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
