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
  }

}
