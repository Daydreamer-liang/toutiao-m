
// 处理 文章模块的请求数据。根据频道ID 获取响应的数据
import request from '@/utils/request'

export function getArticles (params) {
  // 文章数据
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles', // 这里是完整地址，是因为地址不一样
    // 他有三个参数，频道ID，时间戳，和置顶
    params: { with_top: 1, ...params } // 合并 数据
  })
}

// 不感兴趣的接口

export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post', // 请求类型
    data
    // body 参数应该位于 data
  })
}
// 举报文章的接口
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
    // body 参数应该位于 data
  })
}
