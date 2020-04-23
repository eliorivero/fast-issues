const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
module.exports = {
	entry: [ './app/main.js' ],
	output: {
		path: path.join( __dirname, 'public' ),
		filename: 'static/build.js',
	},
	optimization: {
		minimizer: [ new OptimizeCSSAssetsPlugin( {} ), new UglifyJsPlugin() ],
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: __dirname + '/app',
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ [ '@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 } ] ],
					},
				},
			},
			{
				test: /\.scss$/,
				use: [
					'development' === process.env.NODE_ENV ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
	resolve: {
		extensions: [ '*', '.js', '.jsx' ],
		modules: [ path.resolve( __dirname, 'app' ), 'node_modules' ],
		mainFiles: [ 'index' ],
	},
	devServer: {
		port: 3000,
		open: false,
		proxy: {
			'/api': 'http://localhost:8080',
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin( {
			template: 'app/index.html',
			inject: false,
			isDev: process.env.NODE_ENV === 'development',
		} ),
		new MiniCssExtractPlugin( { filename: 'static/style.css' } ),
		new CopyPlugin( [ { from: 'app/favicon', to: '../public/static' } ] ),
	],
};
