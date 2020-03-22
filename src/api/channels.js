
// 负责频道api

import request from '@/utils/request'
import store from '@/store'

const CACHE_CHANNEL_V = 'hm-914-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-914-toutiao-t' // 游客用户的key
// 用户的频道数据
export function getMyChannels () {
  // 频道数据-用户的频道数据
  //   return request({
  //     url: '/user/channels'
  //   })
  return new Promise(function (resolve, reject) {
    // store.state.user.token ?登陆用户：游客
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const str = localStorage.getItem(key) // 通过缓存key获取缓存中的用户的频道数据
    if (str) {
      // 本地缓存有数据 应该把本地数据释放给 后面的执行结果
      resolve({ channels: JSON.parse(str) }) // 这里的结构 是和 请求体中的结构一致的
    } else {
      // 本地缓存没有数据 本地没有数据 就要去线上拉取数据
      request({ url: '/user/channels' }).then(result => {
        // 获取 请求的结果
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 这里还需要 resolve 我们的数据
        resolve(result) // 这里表示直接 成功执行了 获取用户频道数据
        // 频道数据 先把这个数据放入缓存
      }) // 得到线上的一个用户频道列表数据  先把这个数据放入缓存
    }
  })
}

// 全部的频道数据
export function getAllChannels () {
  // 频道数据-用户的频道数据
  return request({
    url: '/channels'
  })
}

// 删除频道,id作为删除的依据

export function delChannels (id) {
  // 频道数据-用户的频道数据
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key))// 直接将数据转换为对象
    // 直接删除
    // 第一种
    // channels = channels.filter(item => item.id !== id)
    // localStorage.setItem(key, JSON.stringify(channels))
    // 第二种
    const index = channels.findIndex(item => item.id === id)
    //   找到对应的下标 删除
    if (index > -1) {
      channels.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(channels))
    } else {
    //   console.log(id)

      reject(new Error('没有此频道'))
    }
  })
}
