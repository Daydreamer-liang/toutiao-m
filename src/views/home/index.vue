<template>
  <div class="container">
    <!-- 放置tabs组件 -->
    <van-tabs v-model="articleIndex">
      <!-- 内部需要放置子 标签  title值为当前显示的内容-->
      <!-- van-tab是vant组件的样式  -->
      <!-- <van-tab :title="item.name" v-for="item in channels" :key="item.id"> -->
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 生成若干个单元格 -->
        <!-- 这里为什么叫scroll-wrapper  因为样式中对它进行了设置 -->
        <!-- <div class='scroll-wrapper'>
              <van-cell-group>
                <van-cell title="标题" value="内容" :key="item" v-for="item in 20"></van-cell>
              </van-cell-group>
        </div>-->
        <!-- 需要将频道ID 传递给ArticleList 列表组件 ，props -->
        <!-- openAction 子组件传递过来的 反馈弹层数据 -->
        <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 在tabs下放置图标  编辑频道的图标 -->
    <span class="bar_btn" @click="showChannelEdit=true">
      <!-- 放入图标 vant图标 -->
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- van-popup反馈弹层 -->
    <van-popup v-model="showMoreAction" :style="{ width: '80%' }">
      <!-- report举报文字 -->
      <!-- dislike 不感兴趣/ -->
      <!-- <moreAction @dislike="dislikeArticle" @report="reportArticle"></moreAction>/ -->
      <!-- 怎么拿report 参数，$even 是参数 type-->
      <moreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('reports',$event)"></moreAction>
    </van-popup>
    <!-- 此时，频道管理 放在弹出面板，不是弹层 -->
    <van-action-sheet :round="false" title="编辑频道" v-model="showChannelEdit">
      <!-- channels将父组件频道数据传递给子组件 -->
      <ChannelEdit @selectChannel="selectChannel" :channels="channels"></ChannelEdit>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getMyChannels } from '@/api/channels'
import moreAction from './components/more-action'
import { dislikeArticle, reportArticle } from '@/api/articles' // 不感兴趣接口
// import { reportArticle } from '@/api/articles' // 举报文章接口
import eventbus from '@/utils/eventBus' // 引入广播函数
import ChannelEdit from './components/channel-edit' // 引入频道管理
export default {
  data () {
    return {
      channels: [], // 频道数据
      showMoreAction: false, // 是否显示反馈弹层
      articleId: null,
      articleIndex: 0, // 频道ID
      showChannelEdit: false
    }
  },

  components: {
    ArticleList,
    moreAction,
    ChannelEdit
  },
  methods: {
    // 这是频道管理 弹出面板传递过来。跳转到相应页面
    //   子组件触发selectChannel 方法，会调用selectChannel 方法
    // 第一种 ID
    // selectChannel (id) {
    //   //   console.log(id)
    //   //   找到ID 对应的频道的索引
    //   const index = this.channels.findIndex(item => item.id === id) // 获取切换频道的索引
    //   this.articleIndex = index // 将tabs激活标签切换到对应的标签下
    //   this.showChannelEdit = false // 关闭弹层
    // },
    // 第二种 索引
    selectChannel (index) {
      this.articleIndex = index // 将tabs激活标签切换到对应的标签下
      this.showChannelEdit = false // 关闭弹层
    },
    //   显示反馈弹层
    openAction (id) {
      //   console.log(id)

      this.showMoreAction = true
      //   把ID存起来
      this.articleId = id
    },
    // 获取频道
    async getMyChannels () {
      const data = await getMyChannels()
      this.channels = data.channels
    },
    //   反馈弹层-不感兴趣
    // 对文章不感兴趣
    // operateType是辨别用户点击‘不感兴趣’，还是举报文章
    // type 对应$event  传递过来的参数
    async dislikeOrReport (operateType, type) {
      // async dislikeArticle () {
      // 调用不感兴趣的文章接口
      //   console.log(type)

      try {
        // await dislikeArticle({
        //   target: this.articleId // 不感兴趣的id
        // })
        operateType === 'dislike'
          ? await dislikeArticle({
            target: this.articleId // 不感兴趣的id
          })
          : await reportArticle({
            target: this.articleId, // 不感兴趣的文章id
            type // 用$even取参数
          })
        // await下方的逻辑 是 resolve(成功)之后 的
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 传递文字ID ，频道ID，this.channels[this.articleId].id--
        eventbus.$emit(
          'delArticle',
          this.articleId,
          this.channels[this.articleIndex].id
        )

        this.showMoreAction = false // 此时关闭弹层
      } catch (error) {
        // 默认是红色
        this.$gnotify({
          message: '操作失败'
        })
        this.showMoreAction = false // 此时关闭弹层
      }
    }
    // 举报文章
    // async reportArticle (type) {
    //   console.log(type)

    //   try {
    //     //   举报成功
    //     await reportArticle({
    //       target: this.articleId, // 不感兴趣的文章id
    //       type
    //     })
    //     // 传递文字ID ，频道ID，this.channels[this.articleId].id--
    //     eventbus.$emit(
    //       'delArticle',
    //       this.articleId,
    //       this.channels[this.articleIndex].id
    //     )

    //     this.showMoreAction = false // 此时关闭弹层
    //   } catch (error) {
    //     this.$gnotify({
    //       message: '操作失败'
    //     })
    //   }
    // }
  },
  created () {
    this.getMyChannels()
  }
}
</script>
<style lang="less" scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
