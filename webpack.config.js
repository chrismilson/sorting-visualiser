const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },
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
  },
  resolve: {
    extensions: [
      '.wasm', '.mjs', '.js', '.json', '.jsx'
    ]
  }
}
