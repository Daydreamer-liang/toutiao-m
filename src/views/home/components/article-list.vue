<template>
  <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
  <div class="scroll-wrapper" @scroll="remember" ref="myScroll">
    <!-- 文章列表 -->
    <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true
    -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successtext">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell
            :to="`/article?artId=${item.art_id.toString()}`"
            v-for="item in articles"
            :key="item.art_id.toString()"
          >
            <!-- 放置文章内容 -->
            <!-- 3个图 -->
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <div class="img_box" v-if="item.cover.type ===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <div class="img_box" v-if="item.cover.type ===1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <span>{{ item.pubdate | reltime}}</span>
                <!-- 点击showAction 触发反馈弹层 -->
                <span
                  @click.stop="$emit('showAction',item.art_id.toString())"
                  class="close"
                  v-if="user.token"
                >
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/articles'
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus' // 引入广播函数
export default {
  // 初始化函数
  created () {
    // 监听删除文章事件
    // 相当于 有多少个实例 就有多少个监听
    // delAriticle  => 假如有四个实例  4个函数
    eventBus.$on('delArticle', (artId, channelId) => {
      //   console.log(artId)
      //   console.log(channelId)

      // 这个位置 每个组件实例都会触发
      // 这里要判断一下 传递过来的频道是否等于 自身的频道
      if (channelId === this.channel_id) {
        // 说明当前的这个article-list实例 就是我们要去删除数据的实例
        const index = this.articles.findIndex(
          item => item.art_id.toString() === artId
        )
        // 判断是否有id
        // console.log(index)

        if (index > -1) {
          this.articles.splice(index, 1)
        }
        if (this.articles.length === 0) {
          //  说明你把数据给删光了
          this.onLoad() // 手动的触发onload事件 给页面加数据
        }
      }
    })

    eventBus.$on('changeTab', id => {
      // id就是当前被激活的页面频道ID
      if (id === this.channel_id) {
        //   用nextTick函数，是因为this.$refs.myScroll 得不到数据，因为是异步渲染
        this.$nextTick(() => {
          // 当滚动元素存在并且不为0
          if (this.scrollTop && this.$refs.myScroll) {
            // 滚动位置加装
            this.$refs.myScroll.scrollTop = this.scrollTop
          }
        })
      }
    })
  },
  data () {
    return {
      successtext: '',
      downLoading: false, // 控制， 下拉刷新整个页面数据
      upLoading: false, // 控制，表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: [], // 文章列表
      timestamp: null, // 历史时间戳
      scrollTop: 0 // 滚动的位置
    }
  },
  computed: {
    ...mapState(['user'])
  },
  props: {
    channel_id: {
      required: true, // 必须传值
      type: Number // 必须是required的类型
      //   default: null// 默认值，没传值，就用默认值
    }
  },
  methods: {
    //   记录滚动的事件
    remember (event) {
      // 防抖
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // console.log(event)
        //   记录滚动位置
        this.scrollTop = event.target.scrollTop
      }, 500)
    },
    //   onload 自己执行，距离底部300
    // 我们在加载数据的时候，页面必须有滚动条，否则onload不会触发，数据就不会加载
    async onLoad () {
      // 上拉，刷新数据，添加到页面最下方
      //   console.log('开始加载数据')
      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      //   setTimeout(() => {
      //     this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      //   }, 1000) // 等待一秒 然后关闭加载状态
      //   if (this.articles.length > 50) {
      //     //   关闭上拉刷新数据
      //     this.finished = true
      //   } else {
      //     const arr = Array.from(Array(15), (value, index) => index + 1)
      //     //   刷新的数据 追加在后面，
      //     this.articles.push(...arr)
      //     //   关掉刷新
      //     this.upLoading = false
      //     this.successtext = '刷新成功了哦'
      //   }
      // 强制等待
      await this.$sleep()
      // 文章列表数据加载
      //   时间戳简单判断，历史时间戳为空就给现在的时间戳，
      const data = await getArticles({
        //   发送请求，给参数：频道ID，时间戳
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now()
      })
      this.articles.push(...data.results) // 文章内容的数据
      this.upLoading = false // 关闭加载
      //   将历史时间戳 给timestamp 保存
      // 判断有历史时间戳
      if (data.pre_timestamp) {
        // 如果有历史时间戳 表示 还有数据可以继续进行加载
        this.timestamp = data.pre_timestamp
      } else {
        // 表示没有数据可以请求了
        this.finished = true
      }
    },
    // 下拉刷新--传最新的时间戳  永远拿最新的数据 ，今日头条就这样
    async onRefresh () {
      await this.$sleep() // 控制，认为控制等待刷新的时间
      // 下拉刷新整个页面数据
      //   const arr = Array.from(Array(2), (value, index) => '追加' + index)
      //   this.articles.unshift(...arr)
      //   // 手动关闭正在加载的状态
      //   this.downLoading = false
      // 加载数据
      const data = await getArticles({
        //   发送请求，给参数：频道ID，时间戳
        channel_id: this.channel_id,
        timestamp: Date.now() // 这里不一样
      })
      // 手动的关闭 下拉刷新的状态
      this.downLoading = false
      //   是否有新的数据，有就覆盖，没有就告诉
      if (data.results.length) {
        this.articles = data.results // 将原先数据全部覆盖了
        // 也就是说还有数据 打开刷新开关，让他能继续刷新 ，并保存历史时间戳
        if (data.pre_timestamp) {
          this.finished = true
          this.timestamp = data.pre_timestamp
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        //   如果没有数据
        this.successText = '当前已经是最新了'
      }
    }
  },
  //   激活缓存组件
  activated () {
    // console.log(1)
    // 判断数据是都变化了
    if (this.$refs.myScroll && this.scrollTop) {
      // 判断是否大于0，并且存在，将div滚动原来的位置
      this.$refs.myScroll.scrollTop = this.scrollTop
    }
  }
}
</script>

<style lang="less" scoped>
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
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
