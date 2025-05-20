const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const path = require('path')

module.exports = {
	mode: 'development',
	entry: {
		main: ['./js/main.js', './styles/styles.scss'],
		shop: ['./js/shop/shop.js', './styles/styles.scss'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|svg|webm)$/i,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 8 * 1024 // 8kb
					}
				},
				generator: {
					filename: 'images/[name][ext]'
				}
			},
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
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),
			filename: 'index.html',
			chunks: ['main']
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'shop.html'),
			filename: 'shop.html',
			chunks: ['shop']
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'basket.html'),
			filename: 'basket.html',
			chunks: ['shop']
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'order.html'),
			filename: 'order.html',
			chunks: ['shop']
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'images', to: 'images' },
				{ from: 'js/shop/products.json', to: 'js/shop/products.json' }
			],
		}),
	],
	optimization: {
		minimizer: [
			new ImageMinimizerPlugin({
				test: /\.(jpe?g|png|gif)$/i,
				exclude: /project_meta\.gif$/,
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							['gifsicle', { 
								interlaced: true, 
								optimizationLevel: 3,
								colors: 256
							}],
							['optipng', { 
								optimizationLevel: 5,
								bitDepthReduction: true,
								colorTypeReduction: true,
								paletteReduction: true
							}],
						]
					}
				},
				generator: [{
					preset: 'webp',
					implementation: ImageMinimizerPlugin.imageminGenerate,
					options: {
						plugins: ['imagemin-webp']
					}
				}]
			})
		]
	},
	performance: {
		maxEntrypointSize: 5120000,
		maxAssetSize: 5120000
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		hot: true,
		liveReload: true,
		port: 3002, // Изменили порт с 3001 на 3002, чтобы избежать конфликта
		watchFiles: ['src/**/*.html'], // Добавляем отслеживание HTML-файлов для автоматического обновления
		open: true, // Автоматически открывать браузер
		devMiddleware: {
			writeToDisk: true, // Записывать файлы на диск для корректной работы с HTML
		},
		client: {
			overlay: true, // Показывать ошибки в оверлее в браузере
			progress: true, // Показывать прогресс сборки
			reconnect: true, // Автоматически переподключаться при потере соединения
		},
	},
}
