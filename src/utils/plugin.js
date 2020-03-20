// 专门处理 提供小函数，以及vue中常用的过滤器函数
// 用vue.use的方式注册
import dayjs from 'dayjs'// 引入dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime'// 引入相对时间插件
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)// 相当于 扩展dayjs的相对时间方法。他就有了form的方法

export default {
  // 导出一个默认对象
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 执行此行代码时 Vue.prototype.$notify 应该已经挂载完成
    // 此函数是提示错误信息
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params }) // 小伎俩
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    // 休眠函数
    Vue.prototype.$sleep = sleep
    // 相对时间-全局过滤器
    Vue.filter('a', relTime)
    // Vue.filter('relTime', relTime)
  }
}
// 休眠函数-不让用户刷新太快
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setInterval(() => resolve(), time)
  })
}

// 相对时间
function relTime (date) {
  // 转换为相对时间
  return dayjs().locale('zh-cn').from(date)
}
