<template>
  <div class="channel-edit">
    <div class="channel">
      <!-- 我的频道： -->
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <!-- 当用户点击，就会跳转到相应的频道页面，并关闭频道管理 层 ,-->
          <!-- 第一种 传递ID 去跳转 -->
          <!-- <span @click="$emit('selectChannel',item.id)" class="f12">{{item.name}}</span> -->
          <!-- 第二种  传 索引-->
          <span
            @click="$emit('selectChannel',index)"
            :class="{red:index=== articleIndex}"
            class="f12"
          >{{item.name}}</span>
          <!-- X号标签 应该点击编辑按钮 才显示 -->
          <van-icon
            @click="$emit('delChannle',item.id)"
            v-if="editing && index>0 "
            class="btn"
            name="cross"
          ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道： -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <!-- 添加 传递一个频道对象-->
          <van-icon @click="$emit('addChannel',item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 正在编辑状态，是否显示删除图标
      AllChannels: []
    }
  },
  //   props:['channels']
  props: {
    channels: {
      required: true, // 必填
      type: Array, // 类型
      default: () => [] // 默认值： 此函数默认返回空数组，它不让直接写空数组，必须是函数的形式
    },
    articleIndex: {
      required: true, // 必填
      type: Number, // 类型
      default: 0 // 默认值： 此函数默认返回空数组，它不让直接写空数组，必须是函数的形式
    }
  },
  methods: {
    //   获取全部的频道
    async getAllChannels () {
      const data = await getAllChannels({})

      this.AllChannels = data.channels
    }
  },
  computed: {
    //   全部频道-用户频道=可选频道
    optionalChannels () {
      return this.AllChannels.filter(
        item => !this.channels.some(o => o.id === item.id)
      )
    }
  },
  created () {
    this.getAllChannels()
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
