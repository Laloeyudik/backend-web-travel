const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  entry: './server.js', // Sesuaikan dengan entry point aplikasi Anda
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,
      terserOptions: {
        compress: {
          drop_console: true,
        },
        output: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', 
      openAnalyzer: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', 
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
