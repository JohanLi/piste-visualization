/* eslint @typescript-eslint/no-var-requires: 0 */

const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/server/index.ts'],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'build'),
  },
  plugins: [new NodemonPlugin()],
  target: 'node',
  node: {
    __dirname: false,
  },
};
