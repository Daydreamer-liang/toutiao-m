
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

// 获取 搜索-联想
export function getSuggestion (params) {
  return request({
    url: '/suggestion', // 搜搜建议地址
    params // query参数放置在 params中
  })
}

// 搜索文章-结果-数据
export function searchArticle (params) {
  return request({
    url: '/search',
    params// 关键词 及分页信息
  })
}

// 文章详情-
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}` // 获取文章详情地址
  })
}

// 文章评论-评论回复
export function getComments (params) {
  return request({
    url: '/comments',
    params // type(是文章的的回复还是回复的回复)  source(来源id)  offset(偏移量 分页依据) 查第二页的数据 传第一页的最后一个id 查第三页的数据  传第二页最后一个id ....
  })
}

// 文章评论-评论或者回复 支持两个场景，第一个是评论，第二个是评论的评论
export function commentOrReply (data) {
  return request({
    url: '/comments',
    method: 'post',
    data
  })
}
