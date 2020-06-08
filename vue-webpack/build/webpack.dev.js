// 开发环境主要实现的是热更新,不要压缩代码，完整的sourceMap

const Webpack = require('webpack');

const webpackConfig = require('./webpack.config');

const webpackMerge = require('webpack-merge');

const { getIpAdress } = require('./webpack.util');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const host = getIpAdress();
const port = 3000;

module.exports = webpackMerge(webpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    openPage: `http://${host}:${port}`,
    port,
    hot: true,
    contentBase: '../dist',
    quiet: true // 设置为true 禁止devServer显示console信息
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(), // 热更新
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${host}:${port}`, `orther you can  running  here http://localhost:${port}`]
      },
      onErrors: {
        messages: [`运行失败`]
      },
      clearConsole: true
    })
  ]
});
