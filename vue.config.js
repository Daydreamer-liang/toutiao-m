// 更改vant 主题颜色
module.exports = {
  // 覆盖蓝色主题 重启服务器
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  },
  configureWebpack: (config) => {
    // 打包 config 是vue-cli中所有的webpack配置
    // 判断是开发环境 还是生产环境
    if (process.env.NODE_ENV === 'production') {
      // 只需要在生产环境中 ，把所有console 删除 在打包，此时不是删除源代码的，而是打包之后的console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './'// 打包后引用地址，不然访问不了

}
