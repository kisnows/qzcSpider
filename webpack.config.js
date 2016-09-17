/**
 * @author hzyuanqi1
 * @create 2016/8/3.
 */
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const env = require('./env')

const cwd = process.cwd()
const publicPath = `//${env.cdnHost}:${env.cdnPort}/${env.cdnPath}`
const nodeModulePath = path.join(cwd, 'node_modules')

let isExt = process.env.NODE_ENV === 'DEV' ? '' : '.min'

const alias = {
  'react': path.join(nodeModulePath, `react/dist/react${isExt}.js`),
  'react-dom': path.join(nodeModulePath, `react-dom/dist/react-dom${isExt}.js`),
  'redux': path.join(nodeModulePath, `redux/dist/redux${isExt}.js`),
  'react-redux': path.join(nodeModulePath, `react-redux/dist/react-redux${isExt}.js`),
  'react-router': path.join(nodeModulePath, `react-router/umd/ReactRouter${isExt}.js`),
  'react-router-redux': path.join(nodeModulePath, `react-router-redux/dist/ReactRouterRedux${isExt}.js`),
  'redux-thunk': path.join(nodeModulePath, `redux-thunk/dist/redux-thunk${isExt}.js`)
}

const aliasKeys = (()=>Object.keys(alias))()

const webpackConfig = {
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(cwd, 'dist'),
    filename: '[name]-[hash:8].js',
    chunkFilename: '[name]-[chunkhash:8].js',
    publicPath: publicPath
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.sass',],
    alias: alias
  },
  module: {
    loaders: [
      {
        test: /\.(css|scss|sass)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
      },
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        exclude: [/node_modules/, /db/],
        include: cwd
      },
      {
        test: /\.(jpeg|jpg|png|gif)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=10240&name=images/[path][name].[ext]?[hash:16]&context=' + path.resolve(cwd, 'src/assets/images')
      },
      {
        test: /\.(ttf|woff|woff|eot|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=10240&name=font/[name].[ext]?[hash:16]&context=' + path.resolve(cwd, 'src/assets/font')
      },
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-[hash:8].js'),
    new ExtractTextPlugin('css/app-[hash:8].css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './app/index.html'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ProvidePlugin({
      // 'Promise': 'es6-promise', // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  postcss: function () {
    return [
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ];
  }
}

if (process.env.NODE_ENV === 'DEV') {
  webpackConfig.devtool = 'cheap-module-eval-source-map'
  webpackConfig.entry = [
    'webpack-hot-middleware/client',
    './app/index'
  ]
  webpackConfig.output.publicPath = '/'
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }))
  webpackConfig.module.noParse = []

} else if (process.env.NODE_ENV === 'PROD') {

  webpackConfig.entry = {
    main: ['./app/index'],
    vendor: aliasKeys
  }
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compressor: {
        warnings: false
      }
    })
  )

}

module.exports = webpackConfig
