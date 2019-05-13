const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    path: path.resolve(__dirname, 'dist/root-app')
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      title: 'Root App',
      filename: path.resolve(__dirname, 'dist/index.html')
    })
  ]
};