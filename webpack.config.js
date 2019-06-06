const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './js/app.js',
  output: {
    path: __dirname + '/docs',
    filename: 'bundle.min.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: '*.html' },
      { from: '*.png' },
      { from: '*.jpg' },
      { from: './js/index.js' },
      { from: './js/main.js' },
      { from: './js/LZWEncoder.js' },
      { from: './js/NeuQuant.js' },
      { from: './js/GIFEncoder.js' },
      { from: './images/*.jpg' },
      { from: './images/*.png' },
      { from: './images/*.ico' },
      { from: './images/*.gif' },
      { from: './examples/*.gif' },
    ])
  ],
  module: {
    rules: [{
      test: /\.(s)*css$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }, {
      test: /\.(jpg|png)$/,
      use: [
        'url-loader'
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        'babel-loader'
      ]
    }]
  }
}
