<template>
  <!-- 反馈组件 -->
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <!-- 点击-是调用父组件的方法，ID在父组件 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell
        @click="$emit('report', item.value)"
        v-for="item in reports"
        :key="item.value"
      >{{item.label}}</van-cell>
      <!-- <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>-->
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants'
import eventbus from '@/utils/eventBus' // 引入广播函数
export default {
  data () {
    return {
      isReport: false, // 是否举报，默认不举报
      reports // 变量
    }
  },
  created () {
    eventbus.$on('delArticle', () => {
      this.isReport = false
    })
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
