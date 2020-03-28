<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="myList">
      <!-- 小智同学 -->
      <div
        class="chat-item"
        :class="{left:item.name==='xz',right:item.name !== 'xz'}"
        v-for="(item , index ) in list"
        :key="index"
      >
        <van-image v-if="item.name === 'xz'" fit="cover" round :src="XZImg" />
        <!-- <van-image v-else fit="cover" round :src="this.photo" /> -->
        <div class="chat-pao">{{item.msg}}</div>
        <van-image v-if="item.name !== 'xz'" fit="cover" round :src="photo" />
      </div>
      <!-- 我说的话 -->
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image fit="cover" round :src="photo" />
      </div>-->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZImg from '@/assets/xz.gif' // 引入一张图片
import { mapState } from 'vuex'
import io from 'socket.io-client' // 小智语音-引入socket.io 客户端
export default {
  data () {
    return {
      loading: false, // 控制输入的状态
      value: '', // 输入的内容
      list: [], // 用来储存聊天记录
      XZImg
    }
  },
  methods: {
    //   发送消息
    send () {
      //   判断是否有内容
      if (!this.value) return false
      //   如果有内容，打开状态.防止重复提交
      this.loading = true
      //   调用websocket 发送消息emit('消息类型'，'消息')
      const obj = {
        // 消息内容
        msg: this.value,
        // 时间戳
        timestamp: new Date()
      }
      //   将消息传给了 服务器
      this.socket.emit('message', obj)
      //   将消息追加到页面
      this.list.push(obj)
      //   将消息置空
      this.value = ''
      //   关闭
      this.loading = false
      //   滚动到底部
      this.scrollBotton()
    },
    // 将内容滚动到底部 设置 滚动条的scrollTop(滚动条距离顶部的长度) = scrollHeight(整个容器的实际高度W)
    scrollBotton () {
      // 数据渲染是异步，我们等数据加载完-渲染完页面执行  ，$nextTick(),页面加载完毕才执行
      this.$nextTick(() => {
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      })
    }
  },
  computed: {
    //   引入xuex的头像  并更新
    ...mapState(['photo', 'user'])
  },
  created () {
    //   建立socket连接-接口规定-需要token- this.socket这样用可以在别的方法里用
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.user.token
      }
    })
    this.socket.on('connect', () => {
      //   console.log(1)
      // 此时 执行connect事件，表示接通服务器
      this.list.push({ msg: '你好', name: 'xz' })
    })
    // 接收消息
    this.socket.on('message', data => {
      console.log(JSON.stringify(data))
      this.list.push({ ...data, name: 'xz' })
      //   滚动到底部
      this.scrollBotton()
    })
  },
  //   实例销毁之前
  beforeDestroy () {
    //   关闭连接的服务器
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
