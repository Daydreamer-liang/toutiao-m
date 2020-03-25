<template>
  <!-- 评论组件 -->
  <div class="comment">
    <!-- 上拉加载 评论不能一下全部加载完 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="comment in comments"
        :key="comment.com_id.toString()"
      >
        <van-image round width="1rem" height="1rem" fit="fill" :src="comment.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <span class="time">{{comment.pubdate|reltime}}</span>&nbsp;
            <!-- 点击弹出评论的回复 -->
            <van-tag plain @click="openReply(comment.com_id.toString())">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 这里是写评论的 -->
    <div class="reply-container van-hairline--top">
      <!-- 绑定评论的内容 -->
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>
    <!-- 这里是评论别人评论的 弹出面板-->
    <!-- 回复 closed关闭面板时 评论ID 设置为空，目的：判断是通过ID判断是评论内容，还是评论评论-->
    <van-action-sheet
      @closed="reply.commentId=null"
      v-model="showReply"
      :round="false"
      class="reply_dialog"
      title="回复评论"
    >
      <!-- :immediate-check="false" 关闭第一次 load 执行事件 ，我们自己点击触发 第二次以后 用 @load="getReply"去获取数据 -->
      <van-list
        @load="getReply"
        :immediate-check="false"
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="item in reply.list"
          :key="item.com_id.toString()"
        >
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p>
              <span class="name">{{item.aut_name}}</span>
            </p>
            <p>{{ item.content }}</p>
            <p>
              <span class="time">{{item.pubdate | reltime}}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles' // 获取评论数据
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 评论数据
      comments: [],
      // 偏移量：分页的依据，
      offset: null,
      // 是否显示面板
      showReply: false,
      reply: {
        //   评论的评论
        // 此对象专门放置 面板加载信息
        // 评论的评论的加载状态
        loading: false,
        // 评论的评论是否加载完毕
        finished: false,
        // 偏移量 作为评论的评论分页加载的时候 查询的依据
        offset: null,
        // 存放 评论的评论的数据
        list: [],
        // 用来存放我们的评论id
        commentId: null
      }
    }
  },
  methods: {
    //   获取数据，只会点击时，触发，只执行一次
    async onLoad () {
      //   数据的加载
      const { artId } = this.$route.query
      //   请求数据
      const data = await getComments({
        // a(文章的评论)   c(评论的评论)
        type: 'a',
        // 给ID， 表示你查找谁
        source: artId,
        // 给当前的偏移量
        offset: this.offset
      })
      this.comments.push(...data.results)
      //   关闭加载状态
      this.loading = false
      // 如果它俩相等 表示 game over  没有数据了
      this.finished = data.end_id === data.last_id
      //   判断是否还有数据没有加载完毕
      if (!this.finished) {
        //   表示还有数据没有加载完
        this.offset = data.last_id
      }
    },
    // 打开评论的回复
    openReply (commentId) {
      // 弹出面板
      this.showReply = true
      //   弹出面板 重置数据
      this.reply.commentId = commentId
      //   清空数据
      this.reply.list = []
      // 弹出的都是新数据  所以清空offset = null 请求的是第一页的数据
      this.reply.offset = null
      //   打开 加载数据finished = false 是打开
      this.reply.finished = false
      // 主动打开加载状态 因为此时没有 主动检查
      this.reply.loading = true
      //   获取一次数据
      this.getReply()
    },
    // 用来获取评论的评论数据-第二层评论(此函数可以获取多次数据 openReply函数只执行一次获取数据的事件)
    async getReply () {
      const data = await getComments({
        // a(文章的评论)   c(评论的评论)
        type: 'c',
        // 给ID， 表示你查找谁
        source: this.reply.commentId,
        // 给当前的偏移量
        offset: this.reply.offset
      })
      //   将返回的数据给变量
      this.reply.list.push(...data.results)
      // 关闭加载状态
      this.reply.loading = false
      // 如果它俩相等 表示 game over  没有数据了
      this.reply.finished = data.end_id === data.last_id
      //   判断是否还有数据没有加载完毕
      if (!this.reply.finished) {
        //   表示还有数据没有加载完// finished: false, // 评论的评论是否加载完毕
        this.reply.offset = data.last_id
      }
    },
    // 提交按钮
    async submit () {
      //   判断用户是否登录，没登录，不能评论
      // if(this.$store.state.user.token)
      if (this.$store.state.user.token) {
        // 此时。用户登录了，判断用户是否评论内容
        if (!this.value) return false
        // 如果用户评论了内容，把提交状态打开，表示用户正在提交内容,避免用户重复提交
        this.submiting = true
        // 休眠函数 来控制 执行的速度
        await this.$sleep(300) // 强制休眠800毫秒
        try {
          // 提交内容
          const data = await commentOrReply({
            // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id） this.$toute.query.artId 是文章ID
            target: this.reply.commentId
              ? this.reply.commentId
              : this.$route.query.artId,
            // 评论内容
            content: this.value,
            // 文章id，对评论进行评论时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
            art_id: this.reply.commentId ? this.$route.query.artId : null
          })
          // 希望调用完成之后 , 添加的评论数据 直接添加到我们的评论列表，判断是评论的哪个
          if (this.reply.commentId) {
            //  添加到面板 此时是对评论进行的评论
            this.reply.list.unshift(data.new_obj)
            // 此时，有个bug，回复的数量 没有实时更新，找到回复的数量 +1
            const comment = this.comments.find(
              item => item.com_id.toString() === this.reply.commentId
            )
            // 回复的数量 + 1
            comment && comment.reply_count++
          } else {
            //  添加到面板 此时是对文章进行的评论,加到前面 ,new_obj是这条评论的全部信息
            this.comments.unshift(data.new_obj)
          }
        } catch (error) {
          this.$gnotify({
            message: '评论失败'
          })
        }

        // 按钮状态关闭
        this.submiting = false
        this.value = ''
      } else {
        //   用户没有登录，不能评论
        try {
          await this.$dialog.confirm({
            message: '需登录才可评论'
          })
          //   如果点击了确定，跳转登录页,并且登录成功，回到原来的页面
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullPath
            }
          })
        } catch (error) {}
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
