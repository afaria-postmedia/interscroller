/**
 *  webpack.config.js
 *
 *  @type webpack configuration
 */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const NAME = 'innerscroller';
const SRC_PATH = path.resolve('./src');
const DIST_PATH = path.resolve('./dist');

module.exports = {
  entry: [`${SRC_PATH}/app/index.ts`, `${SRC_PATH}/styles/index.scss`],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  output: {
    path: DIST_PATH,
    filename: `${NAME}.js`
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        include: `${SRC_PATH}/app`,
        loader: 'ts-loader',
        exclude: path.resolve('./node_modules')
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        include: `${SRC_PATH}/app`,
        loader: 'source-map-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${NAME}.css`
    }),
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html'
    })
  ]
};
