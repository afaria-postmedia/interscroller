/**
 *  webpack.config.js
 *
 *  @type webpack configuration
 */

const path = require('path');

const NAME = 'innerscroller';
const SRC_PATH = path.resolve('./src');
const DIST_PATH = path.resolve('./dist');

module.exports = {
  entry: [`${SRC_PATH}/app/index.ts`],
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
      }
    ]
  }
};
