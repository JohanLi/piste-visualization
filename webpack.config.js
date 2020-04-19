/* eslint @typescript-eslint/no-var-requires: 0 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

let cssHmr = false;
let cssFilename = 'styles-[contenthash].css';
let additionalClientConfig = {};

module.exports = (env = {}) => {
  const { development } = env;

  if (development) {
    cssHmr = true;
    cssFilename = 'styles.css';
    additionalClientConfig = {
      mode: 'development',
      devtool: 'source-map',
      watch: true,
      devServer: {
        hot: true,
        historyApiFallback: true,
      },
    };
  }

  return {
    entry: ['@babel/polyfill', './src'],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: cssHmr,
              },
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle-[hash].js',
      path: path.join(__dirname, 'build'),
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body',
      }),
      new MiniCssExtractPlugin({ filename: cssFilename }),
      new Dotenv(),
    ],
    ...additionalClientConfig,
  };
};
