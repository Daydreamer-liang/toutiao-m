import Vue from 'vue'
import Vuex from 'vuex'
// import { getUser, setUser } from '@/utils/auth'// 引入token管理模块
import * as auth from '@/utils/auth'// 引入token管理模块 所有的方法都在auth里

Vue.use(Vuex)

export default new Vuex.Store({
  // 1.state：公共状态
  state: {
    // user对象就是token信息的对象
    user: auth.getUser(),
    photo: null // 用户头像
  },
  // 2.mutations：修改公共状态
  mutations: {
    //   修改token
    updateUser (state, payload) {
      state.user = payload.user// 修改token，此时 缓存中的数据没有变化
      //   修改完 也要将最新的数据 存起来
      auth.setUser(payload.user)// 相当于保持vuex 与本地存储的同步
    },
    //   删除token
    delUser (state) {
      state.user = {}// 将token 设置为空对象  不可以是null，此时，缓存数据没有变化
      //   删除本地缓存token
      auth.delUser()// 调用删除方法
    },
    // 修改用户头像
    updataPhoto (state, payload) {
      state.photo = payload.photo
    }
  },
  // 3.actions：给公共状态提供数据支持
  actions: {
  },
  modules: {
  }
})
