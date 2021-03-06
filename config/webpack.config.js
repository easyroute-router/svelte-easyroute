const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  const mode = argv.mode
  const prod = mode === 'production'
  console.log('Building DEMO app for', mode)
  return {
    entry: {
      bundle: ['./docs-app/src/main.js']
    },
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte'),
        '@router': path.resolve('.')
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
      path: __dirname + './../docs-app/public',
      filename: 'files/js/[name].[contenthash].js',
      chunkFilename: 'files/js/[name].[contenthash].js',
      publicPath: '/'
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
              hydratable: true
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
            prod ? MiniCssExtractPlugin.loader : 'style-loader',
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
    mode,
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'files/css/[name].[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        template: 'docs-app/src/index_template.ejs',
        title: 'Svelte Easyroute',
        filename: prod ? 'app.html' : 'index.html'
      }),
      new CopyPlugin({
        patterns: [
          { from: '**/*', to: 'files/pages', context: 'docs-app/src/texts' },
          {
            from: '*',
            to: './',
            context: 'docs-app/src/assets/favicons'
          }
        ]
      })
    ],
    devtool: prod ? false : 'source-map',
    devServer: {
      historyApiFallback: true
    }
  }
}
