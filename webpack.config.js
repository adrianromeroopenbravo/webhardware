/*global require, module, __dirname */

require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: './web-src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, { loader: 'css-loader' }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/web',
    publicPath: './',
    filename: 'bundle.js'
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          priority: 100,
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          filename: '[name].bundle.js',
          enforce: true
        },
        common: {
          priority: 1,
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          filename: '[name].bundle.js',
          enforce: true
        }
      }
    }
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new HtmlWebPackPlugin({
      title: 'Openbravo - Web Hardware',
      template: './web-src/index.html',
      favicon: './web-src/favicon.ico',
      filename: 'index.html'
    }),
    new WorkboxPlugin.GenerateSW({
      // Progressive web application. PWA.
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true
    })
  ]
};
