
// 负责频道api

import request from '@/utils/request'
// 用户的频道数据
export function getMyChannels () {
  // 频道数据-用户的频道数据
  return request({
    url: '/user/channels'
  })
}

// 全部的频道数据
export function getAllChannels () {
  // 频道数据-用户的频道数据
  return request({
    url: '/channels'
  })
}
