const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = (env, argv) => {
  const mode = argv.mode
  const prod = mode === 'production'
  console.log('Building DEMO app for', mode)
  return {
    entry: {
      bundle: ['./demo-app/src/main.js']
    },
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte')
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
      path: __dirname + './../demo-app/public',
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[name].[contenthash].js',
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
            name: 'assets/[name].[contenthash].[ext]'
          }
        }
      ]
    },
    mode,
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        template: 'demo-app/src/index_template.ejs',
        title: 'Svelte Easyroute'
      }),
      new CopyPlugin({
        patterns: [
          { from: '*', to: 'pages', context: 'demo-app/src/texts' },
          {
            from: '*',
            to: './',
            context: 'demo-app/src/assets/favicons'
          }
        ]
      }),
      prod &&
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, './../demo-app/public'),
          minify: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            keepClosingSlash: true,
            sortAttributes: true
          },
          renderer: new Renderer({
            renderAfterTime: 1000
          }),
          routes: [
            '/',
            '/page/installation',
            '/page/getting-started',
            '/page/dynamic-matching',
            '/page/current-route-info',
            '/page/router-links',
            '/page/programmatic-navigation',
            '/page/nested-routes',
            '/page/css-transitions',
            '/page/navigation-guards',
            '/page/silent-mode',
            '/page/named-outlets',
            '/playground/demo/params'
          ]
        })
    ].filter(Boolean),
    devtool: prod ? false : 'source-map',
    devServer: {
      historyApiFallback: true
    }
  }
}
