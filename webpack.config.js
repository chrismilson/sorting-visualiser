const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

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
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                { targets: { node: 10 } }
              ],
              '@babel/preset-react'
            ]
          }
        }
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
    new HtmlPlugin({ template: './public/index.html' }),
    // copy the static assets to the build folder.
    new CopyPlugin(['public'])
  ]
}
