const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const isDev = process.argv.indexOf('--mode=production') === -1;

const Webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');

// happyPack 基本原理相当于将这部分人文分解到多个子进程去进行处理打包
const HappyPack = require('happypack');




module.exports = {
  mode: 'development', // 开发模式
  entry: {
    main: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
    chunkFilename: 'js/[name].[hash:8].js'
  },
  module: {
    noParse: /jquery/, // 不去解析jquery中的依赖库
    rules: [
      // vue 解析
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false // 不保留空格
              }
            }
          }
        ],
        exclude: /node_modules/ // 不包含
      },
      // js 兼容
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // css less
      {
        test: /\.css$/,
        use: [
          {
            loader: isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/css/',
              hmr: isDev
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/css/',
              hmr: isDev
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
          'less-loader'
        ]
      },
      // 媒体文件或者图片
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'media/[name].[hash:8].[ext]'
              }
            }
          }
        },
        exclude: /node_modules/ // 不包含
      },
      // 字体图标 等
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'media/[name].[hash:8].[ext]'
              }
            }
          }
        },
        exclude: /node_modules/ // 不包含
      },
      // 在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里。 cache-loader 不需要可以删除
      {
        test: /\.ext$/,
        use: [
          'cache-loader'
          // ...loaders
        ],
        include: path.resolve(__dirname, 'src')
      }
    ]
  },
  resolve: {
    // 配置别名 别名易于webpack搜索文件名，加快打包速度
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      ' @': path.resolve(__dirname, '../src')
    },
    // extensions 会根据webpack定义的后缀查找文件,就相当于不写后缀名他的查找顺序,频率较高优先写在前面
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new HappyPack({
      id: 'happyBabel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']],
            cacheDirectory: true
          }
        }
      ]
    }),
    new VueLoaderPlugin(), // 解析vue模版插件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
    }),
    // 配合 webpack.dll.config.js 如果不需要可以删除这几行代码
    new Webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    // 配合 webpack.dll.config.js 如果不需要可以删除这几行代码
    new CopyWebpackPlugin([
      // 拷贝生成的文件到dist目录
      { from: path.resolve(__dirname, './static'), to: 'static' }
    ]),

  ],
  stats: {
    entrypoints: false,
    children: false
  }
};
