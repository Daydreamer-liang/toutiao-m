<template>
  <!-- 评论组件 -->
  <div class="comment">
    <!-- 上拉加载 评论不能一下全部加载完 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
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
            <van-tag plain @click="showReply=true">{{ comment.reply_count }} 回复 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 这里是写评论的 -->
    <div class="reply-container van-hairline--top">
      <!-- 绑定评论的内容 -->
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments } from '@/api/articles' // 获取评论数据
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
      comments: [], // 评论数据
      offset: null // 偏移量：分页的依据，
    }
  },
  methods: {
    //   获取数据
    async onLoad () {
      //   数据的加载
      const { artId } = this.$route.query
      const data = await getComments({
        type: 'a', // a(文章的评论)   c(评论的评论)
        source: artId, // 给ID， 表示你查找谁
        offset: this.offset // 给当前的偏移量
      })
      //   console.log(data)

      this.comments.push(...data.results)
      //   关闭加载状态
      this.loading = false
      this.finished = data.end_id === data.last_id
      if (!this.finished) {
        //   表示还有数据没有加载完
        this.offset = data.last_id
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
</style>
