const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  console.log('Building DEMO app for SSR')
  return {
    entry: {
      bundle: ['./demo-app/src/App.ssr.svelte']
    },
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte'),
        '@router': path.resolve('lib')
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
      path: __dirname + './../demo-app/ssr',
      filename: 'demo-app.ssr.js',
      publicPath: '/',
      libraryTarget: 'commonjs'
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              hotReload: true,
              hydratable: true,
              generate: 'ssr'
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: 'files/assets/[name].[contenthash].[ext]'
          }
        }
      ]
    },
    mode: 'production',
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'files/css/[name].[contenthash].css'
      })
    ],
    devtool: false,
    target: 'node',
    optimization: {
      minimize: false
    }
  }
}
