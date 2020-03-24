<template>
  <div class="container">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name }}</p>
          <p class="time">{{ article.pubdate | relTime }}</p>
        </div>
        <van-button
          :loading="followloading"
          @click="follow"
          round
          size="small"
          type="info"
        >{{article.is_followed ? '已关注':' + 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">
        <!-- <p>文章的内容</p> -->
      </div>
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{active:article.attitude === 1}"
          plain
          icon="like-o"
        >点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          :class="{active: article.attitude === 0}"
          plain
          icon="delete"
        >不喜欢</van-button>
      </div>
    </div>
    <van-overlay :show="loading">
      <div class="wrapper">
        <van-loading type="spinner" color="#1989fa" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unfollowUser } from '@/api/user'
export default {
  data () {
    return {
      article: {}, // 文章详情数据
      followloading: false, // 按钮加载状态
      loading: false // 遮罩层
    }
  },
  methods: {
    //   获取文章详情数据
    async getArticleInfo () {
      // 获取参数
      const { artId } = this.$route.query
      this.article = await getArticleInfo(artId)
    },
    // 关注用户
    async follow () {
      this.loading = true
      this.followloading = true
      // 关注=>  就取消关注
      // 没关注=>  就关注
      try {
        if (this.article.is_followed) {
          // 当关注的时候，调用取消关注的API ，
          await unfollowUser(this.article.aut_id)
        } else {
          // 当关注的时候，调用取消关注的API ，is_followed
          await followUser({ target: this.article.aut_id })
        }
        this.article.is_followed = !this.article.is_followed
      } catch (error) {
        this.$gnotify({ message: '操作失败' })
      } finally {
        //   不论成功还是失败 ，你都要来这里
        this.followloading = false
        this.loading = false
      }
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
