const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        use: 'babel-loader'
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        use: [
          // And finally load the js into style nodes
          'style-loader',
          // Then compile the css to commonjs
          'css-loader',
          // First compile the sass to css
          'sass-loader'
        ] // NOTE: webpack runs the loaders from bottom to top
      }
    ]
  },
  resolve: {
    extensions: [
      '.wasm', '.mjs', '.js', '.json', '.jsx'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ]
}
