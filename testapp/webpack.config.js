const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const sass = require('node-sass');
const autoprefixer = require("autoprefixer");

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		extensions: ['.mjs', '.js', '.svelte']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
						style: ({ content, attributes }) => {
                            if (attributes.type !== "text/scss") return;

                            return new Promise((fulfil, reject) => {
                                sass.render(
                                    {
                                        data: content,
                                        includePaths: ['routes'],
                                        sourceMap: true,
                                        importer: function(url, prev) {
                                            return { file: url };
                                        },
                                        outFile: "x" // this is necessary, but is ignored
                                    },
                                    (err, result) => {
                                        if (err) {
                                            return reject(err);
										}
                                        fulfil({
                                            code: result.css,
                                            map: result.map
                                        });
                                    }
                                );
                            });
                        }
					}
				}
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								autoprefixer({
									browsers:['ie >= 8', 'last 4 version']
								})
							],
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				],
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
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	],
	devServer: {
		historyApiFallback: true
	},
	devtool: prod ? false: 'source-map'
};
