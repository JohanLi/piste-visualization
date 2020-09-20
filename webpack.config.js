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

  if (true) {
    cssHmr = true;
    cssFilename = 'styles.css';
    additionalClientConfig = {
      mode: 'development',
      devtool: 'eval-cheap-module-source-map',
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
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
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
      symlinks: false,
      cacheWithContext: false,
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
