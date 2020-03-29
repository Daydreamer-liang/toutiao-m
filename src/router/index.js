import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home'

Vue.use(VueRouter)
const Layout = () => import('@/views/layout')// 一级路由
const home = () => import('@/views/home')// 二级路由
const question = () => import('@/views/question')// 二级路由
const video = () => import('@/views/video')// 二级路由
const user = () => import('@/views/user')// 二级路由
// 其他一级路由
const chat = () => import('@/views/user/chat')// 一级路由,小智同学组件
const login = () => import('@/views/login')// 一级路由
const profile = () => import('@/views/user/profile')// 一级路由,编辑资料组件
const search = () => import('@/views/search')// 一级路由,搜索中心组件
const result = () => import('@/views/search/result')// 一级路由,搜索结果组件
const article = () => import('@/views/article')// 一级路由,文章详情

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    children: [
      {
        path: '',
        component: home, // 首页
        meta: {
          // 缓存组件
          isAlive: true
        }
      },
      {
        path: '/question',
        component: question// 问答
      },
      {
        path: '/video',
        component: video// 视频
      },
      {
        path: '/user',
        component: user// 个人中心
      }
    ]
  }, {
    path: '/user/chat', // 一级路由
    component: chat// 小智同学组件
  }, {
    path: '/login', // 一级路由
    component: login// 登录组件
  }, {
    path: '/user/profile', // 一级路由
    component: profile// 编辑资料组件
  },
  {
    path: '/search', // 一级路由
    component: search// 搜索中心组件
  },
  {
    path: '/search/result', // 一级路由
    component: result// 搜索结果组件
  },
  {
    path: '/article', // 一级路由
    component: article// 文章详情
  }
]

const router = new VueRouter({
  routes
})

export default router
