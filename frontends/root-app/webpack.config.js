const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    'polyfill': './src/polyfill.ts',
    'index': './src/index.ts'
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist/root-app'),
    publicPath: '/root-app/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: 'head',
      title: 'Root App',
      filename: path.resolve(__dirname, 'dist/index.html')
    }),
    new HtmlWebpackTagsPlugin({ tags: ['styles.css'], append: true }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, 'src/styles.css'), to: path.resolve(__dirname, 'dist/root-app/styles.css') },
    ]),
  ]
};