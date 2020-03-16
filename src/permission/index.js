// 导航守卫。判断是否有token
import router from '@/router'
import store from '@/store'

// 前置守卫 每当路由发生变化时，都会执行。
router.beforeEach(function (to, from, next) {
  // 需要判断你的请求地址和token
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 如果是'/user' 路由的开头，进行token判断 没有的话就拦截，让他去登录
    next({
      path: '/login', // 要跳转的地址
      query: {
        // fullpath 和 path  的区别是 fullPath 会带 ?后面的参数 是一个完整的路径
        redirectUrl: to.fullPath // 告诉登录页 我没有完成 访问 你登录之后 一定要帮我完成
      }
    })
  } else {
    // 一种是 地址不是 /user起始  一种是 /user起始 并且token存在
    next() // 直接放过
  }
})
