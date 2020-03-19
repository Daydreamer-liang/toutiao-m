<template>
  <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
  <div class="scroll-wrapper">
    <!-- 文章列表 -->
    <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true
    -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successtext">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item">
            <!-- 放置文章内容 -->
            <!-- 3个图 -->
            <div class="article_item">
              <h3 class="van-ellipsis">天上天下，唯我独尊。世界，很大，我就是想去看看</h3>
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- <div class="img_box">
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div> -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
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
export default {
  data () {
    return {
      successtext: '',
      downLoading: false, // 控制， 下拉刷新整个页面数据
      upLoading: false, // 控制，表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: []
    }
  },
  methods: {
    //   onload 自己执行，距离底部300
    // 我们在加载数据的时候，页面必须有滚动条，否则onload不会触发，数据就不会加载
    onLoad () {
      // 上拉，刷新数据，添加到页面最下方
      //   console.log('开始加载数据')
      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      //   setTimeout(() => {
      //     this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      //   }, 1000) // 等待一秒 然后关闭加载状态
      if (this.articles.length > 50) {
        //   关闭上拉刷新数据
        this.finished = true
      } else {
        const arr = Array.from(Array(15), (value, index) => index + 1)
        //   刷新的数据 追加在后面，
        this.articles.push(...arr)
        //   关掉刷新
        this.upLoading = false
        this.successtext = '刷新成功了哦'
      }
    },
    onRefresh () {
      // 下拉刷新整个页面数据
      const arr = Array.from(Array(2), (value, index) => '追加' + index)
      this.articles.unshift(...arr)
      // 手动关闭正在加载的状态
      this.downLoading = false
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
