
// 负责频道api

import request from '@/utils/request'

export function getMyChannels () {
  // 频道数据
  return request({
    url: '/user/channels'
  })
}
