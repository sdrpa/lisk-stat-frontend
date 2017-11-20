const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin')
const Webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
   devServer: {
      historyApiFallback: true
   },
   devtool: 'cheap-module-source-map',
   entry: [ 
      './src/index.js',
      './scss/main.scss'
   ],
   output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].js',
   },
   module: {
      rules: [
         {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: 'babel-loader'
               },
               'eslint-loader'
            ]
         },
         {
            test: /\.(sass|scss|css)$/,
            loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
         },
         {
            test: /\.svg$/,
            use: 'raw-loader',
         }
      ]
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: 'src/index.html',
         minify: {
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true
         }
      }),
      new ExtractTextPlugin({
         filename: '[name].bundle.css',
         allChunks: true,
      }),
      // new StyleExtHtmlWebpackPlugin({
      //    minify: true
      // }),
      // new Webpack.optimize.ModuleConcatenationPlugin(),
      // new Webpack.optimize.UglifyJsPlugin({
      //    compress: {
      //       warnings: false,
      //       screw_ie8: true,
      //       conditionals: true,
      //       unused: true,
      //       comparisons: true,
      //       sequences: true,
      //       dead_code: true,
      //       evaluate: true,
      //       if_return: true,
      //       join_vars: true
      //    },
      //    output: {
      //       comments: false
      //    }
      // }),
      // new Webpack.DefinePlugin({
      //    'process.env': {
      //       NODE_ENV: JSON.stringify('production')
      //    }
      // }),
      // new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // new BundleAnalyzerPlugin(),
      // new Webpack.optimize.CommonsChunkPlugin({
      //    name: 'vendor',
      //    filename: 'vendor.[chunkhash].js',
      //    minChunks(module) {
      //       return module.context &&
      //          module.context.indexOf('node_modules') >= 0;
      //    }
      // })
   ],
   target: 'web'
};
