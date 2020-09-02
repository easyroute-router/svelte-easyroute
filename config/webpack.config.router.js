const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './lib/src/Router/Router.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'svelte-easyroute.umd.js',
    libraryTarget: 'umd',
    library: 'svelte-easyroute',
    path: path.resolve(__dirname, '../lib/dist/router')
  },
  plugins: [new CleanWebpackPlugin()]
}
