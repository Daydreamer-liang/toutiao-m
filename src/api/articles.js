
// 处理 文章模块的请求数据。根据频道ID 获取响应的数据
import request from '@/utils/request'

export function getArticles (params) {
  // 文章数据
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    // 他有三个参数，频道ID，时间戳，和置顶
    params: { with_top: 1, ...params } // 合并 数据
  })
}
