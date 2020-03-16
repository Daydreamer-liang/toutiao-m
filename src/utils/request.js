
import axios from 'axios'
import JSONBig from 'json-bigint'// 处理大数字
import store from '@/store'// 引入store 获取token 注入token
import router from '@/router'
// axios.defaults 是对原有的默认值进行修改
// axios.create() 相当于new了 一个新的实例  和原来的axios  没关系
// 1.基地址与大数字
const instance = axios.create({
  //  构造参数 传入一些配置 和defaults一样

  //   1.设置基础基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
  //   2.大数字
  //   此函数是后台相应回来的数据 ，但，还没有进入到axios的相应拦截器时 执行 ，数组里可以写多个处理函数
  transformRequest: [function (data) {
    // data是 后端相应回来的字符串 json.parse()
    // 简单的判断 是否返回有数据
    return data ? JSONBig.parse(data) : {}
  }]
})
// 2.拦截器 ----------------作用：统一注入token，不用访问每个页面的时候 都获取一次
// token的注入是在请求之前 ，在请求拦截器
instance.interceptors.request.use(function (config) {
  // 成功的时候 读取配置信息，给配置信息 注入token
  //
  //   if (store.state.user.token) {
  // config.headers.Authorization = `Bearer ${store.state.user.token}`
  //   注入token
  //   }
  config.headers.Authorization && (config.headers.Authorization = `Bearer ${store.state.user.token}`)
  return config // 返回配置
}, function (error) {
  return Promise.reject(error)// 返回错误 ，会进入到axios的catch里面 被捕获到
})

// 响应拦截器------ + 处理没有token时的方法
instance.interceptors.response.use(function (response) {
  // response 实际上 被axios 包了一层数据 ，data才是我们之前处理过的数据
  try {
    return response.data.data// 如果两层能结构数据
  } catch (error) {
    //   失败了 就证明   response.data 不存在，两层结构不成功 返回一层解构的数据
    return response.data
  }
}, async function (error) {
  //  如果请求失败 或失效或其他错误 会进入到响应拦截器的错误区域
  //  error：
  //  config :是出现这次错误请求的 配置信息
  //  request  :请求对象
  //  response；响应对象 status 状态码

  if (error.response && error.response.status === 401) {
    //   path是登录页和用户浏览页的信息，当用户登录成功，会自动跳转到浏览的页面，而不会是主页
    const path = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.fullPath // 登录页需要跳转的地址
      }
      // 路由传参的两种 动态路由 和 query()
    }
    //   error.response 有可能是空，这里做出判断
    //   状态码是：401，token失效 ,此时 ，应判断本地有没有refresh_token ，(14天有效的refresh_token) 相当于一个续命的药
    if (store.state.user.refresh_token) {
      // 成功时
      // 有refresh_token时，用它换取新的token ，需要接口,去换取新token
      try { // try是判断refresh_token14天过期后 我们执行代码会报错
        const result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'put',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }

        })
        // 此时我们拿到了新的token result.data.data.token  在vuex里更新，如果失败，去登录页登录
        store.commit('updateUser', {
          user: {
            refresh_token: store.state.user.refresh_token, // 还是原来的、14天后过期
            token: result.data.data.token// 最新的token
            //   updateUser()方法会帮我们 把本地的token储存
          }
        })
        //   之所以到这个位置 是因为401 错误 ，也就是说，之前的请求 ，是错的
        // 需要把之前的 错误  ，发送出去
        return instance(error.config) // 相当于 执行之前出现401错误的请求  返回(ruturn)这个请求的目的 是继续执行这个请求执行链下面的内容(pramise原理)
      } catch (error) {
        // 此时，refresh_token已经过期，报错了，不能换取新的token  ，需返回登录页 重新登录，并删除token
        store.commit('delUser')
        // 重新跳到登录页面
        router.push(path)
      }
    } else {
      // 失败时
      //   没有refresh_token ，直接跳到登录页
      // 此时，我们直接跳过去没问题，但，如果我登录成功，是否还会返回我浏览的页面 ，还是回到主页
      // 所以，我们要把用户浏览到页面的信息 传递到登录页、
      //   router.currentRoute.fullPath   // 获取当前路由的完整地址
      //   router.push('/login')
      router.push(path)
    }
  }
  return Promise.reject(error)
})
export default instance // 将实例导出
