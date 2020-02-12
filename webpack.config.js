const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WorkerPlugin = require('worker-plugin')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.[hash].js'
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
    new CleanWebpackPlugin(),
    new HtmlPlugin({ template: './public/index.html' }),
    new WorkerPlugin({ globalObject: 'self' }),
    // copy the static assets to the build folder.
    new CopyPlugin(['public'])
  ]
}
