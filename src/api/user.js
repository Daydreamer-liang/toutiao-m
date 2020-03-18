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
