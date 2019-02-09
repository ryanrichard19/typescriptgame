const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/app.ts',
	output: {
		path: path.resolve(__dirname+ '/dist'),
		filename: "bundle.js",
		publicPath: '/',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
    devServer: {
		contentBase: './dist'
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				use: [
					{ loader: "ts-loader" }
				]
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					"style-loader",
					"css-loader"
				]
			},
			{
				test: /\.(png|jpg|mp3)$/,
				exclude: /node_modules/,
				use: [
					{ 
						loader: 'file-loader',
						options: {
							outputPath: 'images',
						  },
					}
				]
			},
			{
				test: /\.(png|jpg)$/,
				exclude: /node_modules/,
				loader: 'url-loader',
				options: {
					name: './../images/[name].[ext]',
					publicPath: './images/'
				}
			}
		]
	},
	plugins: [
    new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],
	devServer: {  // configuration for webpack-dev-server
		contentBase: './src/public',  //source of static assets
		port: 8080,
	} 
}