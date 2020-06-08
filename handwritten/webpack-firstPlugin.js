// 手写一个webpack 

class FirstPlugin{
  constructor(options){
    this.options = options
  }
  apply(compiler){
    compiler.plugin('emit',(compilation,callback)=>{
      let str = ''
      for (const filename in compilation.assets) {
        str += `文件:${filename}  大小${compilation.assets[filename]['size']()}\n`;
      }
      compilation.assets['fileSize.md'] = {
        source:function(){return str},
        size:function(){return str.length}
      }
      callback()
    })
  }
}
module.exports = FirstPlugin