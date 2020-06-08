### 快速练习选自 掘金  https://juejin.im/post/5de87444518825124c50cd36,代码不懂可以参考文章


### note

##### webpack-test1

* 初始化安装  `npm init` `npm i -D webpack webpack-cli`

* 简单配置
```javascript
...
module.exports = {
  mode:'development',
  entry:path.resolve(__dirname,'../src/main.js'),
  output:{
    filename:'output.js',
    path:path.resolve(__dirname,'../dist')
  }
}
// script : "build" : "webpack --config build/webpack.config.js"
```
* filename: '[name].[hash:8].js'  生成哈希文件
* 插件 html-webpack-plugin  自动改变引入的js文件名称与哈希值匹配（插件功能之一）
* 多入口 每一个增加chunks
* 插件 clean-webpack-plugin 每次执行清空输出文件夹
* style-loader css-loader less less-loader 解析less css  // 从右向左解析原则 
* postcss-loader autoprefixer   为css添加浏览器前缀
* mini-css-extract-plugin 拆分css
* extract-text-webpack-plugin@next 拆分多个css
* rules： url-loader file-loader 打包文字 图片文件 媒体文件
* babel-loader @babel/preset-env @babel/core  兼容更多环境

##### vue-webpack

* 具体实施看代码
* 有时我们希望我们通过script引入的库，如用CDN的方式引入的jquery，我们在使用时，依旧用require的方式来使用，但是却不希望webpack将它又编译进文件中。这里官网案例已经足够清晰明了  官网连接https://webpack.js.org/configuration/externals/#root
```js
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
module.exports = {
  //...
  externals: {
    jquery: 'jQuery'
  }
};
import $ from 'jquery';
$('.my-element').animate(/* ... */);

```

### handwritten
* 手写loader
* 手写plugin

### webpack 5.0 
* 待增加