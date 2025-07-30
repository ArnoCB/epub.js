var path = require('path');
var webpack = require('webpack');

var MINIMIZE = process.env.MINIMIZE === 'true';
var hostname = 'localhost';
var port = 8080;

var filename = '[name]';
var sourceMapFilename = '[name]';
if (MINIMIZE) {
  filename += '.min.js';
  sourceMapFilename += '.min.js.map';
} else {
  filename += '.js';
  sourceMapFilename += '.js.map';
}

module.exports = {
  experiments: {
    outputModule: true,
  },
  mode: process.env.NODE_ENV,
  entry: {
    epub: './src/epub.js',
  },
  devtool: MINIMIZE ? false : 'source-map',
  output: {
    path: path.resolve('./dist'),
    filename: filename,
    sourceMapFilename: sourceMapFilename,
    library: {
      type: 'module',
    },
    publicPath: '/dist/',
  },
  optimization: {
    minimize: MINIMIZE,
  },
  externals: {
    'jszip/dist/jszip': 'JSZip',
    xmldom: 'xmldom',
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    alias: {
      path: 'path-webpack',
    },
    fallback: {
      assert: require.resolve('assert/'),
    },
  },
  devServer: {
    host: hostname,
    port: port,
    inline: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets:
                    'last 2 Chrome versions, last 2 Safari versions, last 2 ChromeAndroid versions, last 2 iOS versions, last 2 Firefox versions, last 2 Edge versions',
                  corejs: 3,
                  useBuiltIns: 'usage',
                  bugfixes: true,
                  modules: false,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  performance: {
    hints: false,
  },
};
