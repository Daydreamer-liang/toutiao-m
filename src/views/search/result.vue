<template>
  <div class="container">
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <!-- 将 导航栏固定在顶部 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 防止搜索结果列表 -->
    <!-- 上拉加载状态、 -->
    <van-list v-model="upLoading" @load="onLoad" :finished="finished">
      <van-cell-group>
        <van-cell :to='`/article?artId=${item.aut_id.toString()}`' v-for="item in articles" :key="item.aut_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type ===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type === 1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ item.aut_name }}</span>
              <span>{{ item.comm_count }}评论</span>
              <!-- 用过滤器来处理相对时间 -->
              <span>{{ item.pubdate|reltime  }}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
// import { searchArticle} from '@/api/articles'
import * as Article from '@/api/articles'
export default {
  data () {
    return {
      //  upLoading: false, // 上拉加载状态
      //       finished: false, // 表示当前的加载是否全部完成了 如果全部完成 应该将finished设置成true
      //       articles: [], // 放置搜索结果文章的
      //       page: {
      //         page: 1, // 当前第几页
      //         per_page: 10 // 每页的多少条
      upLoading: false,
      finished: false,
      articles: [],
      page: {
        page: 1,
        per_page: 10
      }
    }
  },
  methods: {
    //   该函数会在滚动条到底部执行
    async onLoad () {
      //   alert(1)
      const { q } = this.$route.query // 获取搜索内容
      const data = await Article.searchArticle({ ...this.page, q }) // 结构数据
      //   this.articles.unshift(...data.results)
      this.articles.push(...data.results)
      //   关闭上拉加载
      this.upLoading = false
      //   如果知道 上拉加载 加载完所有的数据了
      if (data.results.length) {
        //   如果还有数据 获取下一页的数据
        this.page.page++
      } else {
        //   表示已经没有数据要加载了
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
