
// ++++----
import axios from 'axios'
import JSONBig from 'json-bigint' // 引入大数字插件
import store from '@/store' // 引入vuex中的store实例对象 相当于 组件中的 this.$store
import router from '@/router' // 引入router对象
// axios.defaults 是对原有默认值进行修改
// axios.defaults 是对原有的默认值进行修改
// axios.create() 相当于new了 一个新的实例  和原来的axios  没关系
// 1.基地址与大数字
const instance = axios.create({
  //  构造参数 传入一些配置 和defaults一样

  //   1.设置基础基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
  //   2.大数字
  //   此函数是后台相应回来的数据 ，但，还没有进入到axios的相应拦截器时 执行 ，数组里可以写多个处理函数
  transformResquest: [function (data) {
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
  // response实际上已经被 axios 默认包了一层数据  data才是 我们之前处理过的数据
  // 几乎所有的返回数据都有一层data
  try {
    return response.data.data // 如果成功则返回  如果两层可以解开 就返回两层
  } catch (error) {
    //  如果失败 说明 response.data不存在  如果两层解不开 就返回一层
    return response.data
  }
}, async function (error) {
  //  如果请求失败 或失效或其他错误 会进入到响应拦截器的错误区域
  //  error：
  //  config :是出现这次错误请求的 配置信息
  //  request  :请求对象
  //  response；响应对象 status 状态码

  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login', // 地址
      query: {
        // 需要传递的query参数
        redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的地址
      }
      // 路由传参的两个写法  动态路由  query()
    }
    //   如果状态码是401的话  就认为token失效了 就需要处理token失效问题
    // refresh_token  相当于一个续命的药
    if (store.state.user.refresh_token) {
      // 成功时
      // 有refresh_token时，用它换取新的token ，需要接口,去换取新token
      try {
        const result = await axios({
          method: 'put', // 请求类型
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 完成的url地址
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` } // 在请求头中注入refresh_token
        })
        //   await 后面就是 promise成功执行完成的逻辑
        // 新token
        // 如果成功了 应该更新失效的token
        // 直接更新vuex中的数据
        store.commit('updateUser', {
          //   载荷数据
          user: {
            // token
            token: result.data.data.token, // 最新的token
            refresh_token: store.state.user.refresh_token // 还是原来的refresh_token 14天之后过期
          }
        }) // 提交mutations 更新vuex数据
        //   你之所以会到这个位置 是因为  401, 也就意味着你之前的请求 是错误的
        //  需要把之前错误的请求再次发送出去 用axios 还是 instance呢
        // A =>  B  => C  =>  D
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
      store.commit('delUser')
      router.push(path)
    }
  }
  return Promise.reject(error)
})
export default instance // 将实例导出
