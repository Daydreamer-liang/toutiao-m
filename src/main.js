import Vue from 'vue'
import App from './App.vue'
import router from './router'// vue 路由、
import store from './store'// vuex 共享状态

import Vant, { Lazyload } from 'vant'// 引入vant组件
import plugin from '@/utils/plugin'
import '@/permission'// 引入权限模块
import 'vant/lib/index.less'
import 'amfe-flexible'
import '@/styles/index.less'

Vue.use(Vant)// 全局注册vant
Vue.use(plugin)// 全局注册plugin,要放在vant之后，我们要用vant函数
Vue.use(Lazyload)// 图片懒加载

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
