// 专门处理用户请求
// 引入我们封装的axios
import request from '@/utils/request'
// 登录方法
export function login (data) {
  return request({
    //   配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    data // 接收传入的data
    // axios 中body参数放置在data中
  })
  // 返回一个promise对象
}

// 文章详情-关注按钮-关注用户
export function followUser (data) {
  return request({
    url: '/user/followings', // 关注用户
    method: 'post',
    data
    // body 参数  body data  query params
  })
}
// 文章详情-关注按钮-取消关注
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}

// 获取用户的个人信息-粉丝，文章数量，
export function getUserInfo () {
  return request({
    url: '/user'
  })
}

// 获取用户的个人信息-头像，生日，手机号
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}

// 修改用户头像
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}

// 保存用户全部信息
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null } // 直接将photo设置为空
  })
}
