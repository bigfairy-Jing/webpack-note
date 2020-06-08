
// 生产环境主要实现的是压缩代码、提取css文件、合理的sourceMap、分割代码

const path = require('path')

const webpackConfig = require('./webpack.config')

const webpackMerge = require('webpack-merge')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

// const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const parallelUglifyPlugin = require('webpack-parallel-uglify-plugin') // 使用webapck增强代码压缩


// 分析打包之后的文件，便于优化 生成依赖图网页
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 自定义插件 生成打包文件信息
const FirstPlugin = require("./plugin-test")

module.exports = webpackMerge(webpackConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist')
      }
    ]),
    // 分析打包之后的文件 不需要可以删除
    // new BundleAnalyzerPlugin({
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8366'
    // }),
    new FirstPlugin()
  ],
  optimization: {
    minimizer: [
      // new UglifyJsPlugin({
      //   cache:true,
      //   parallel:true,
      //   sourceMap:true
      // }),
      new parallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJs: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_var: true
          }
        }
      }),

      new OptimizeCssAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        }
      }
    }
  }
});