const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      // ...babel loader...
      {
        test: /\.xhtml$/i,
        use: 'raw-loader',
      },
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
                  targets: 'last 2 Chrome versions',
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
  resolve: {
    fallback: {
      assert: require.resolve('assert/'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
