<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell
        @click="toResult(item)"
        icon="search"
        v-for="(item , index) in suggestList"
        :key="index"
      >{{item}}</van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else>
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click="toSearch" v-for="(item , index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <van-icon
            @click.stop="delHistory(index)"
            class="close_btn"
            slot="right-icon"
            name="cross"
          />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles' // 搜索-联想
const key = 'history' // 把历史记录 储存在本地，而不是后端，这属于垃圾信息，我们不用收集用户信息
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: JSON.parse(localStorage.getItem(key) || '[]'), // 搜索历史记录
      suggestList: [] // 联想的搜索建议
    }
  },
  watch: {
    //   联想
    q () {
      //   1.-------- 防抖
      clearTimeout(this.timer)
      //   console.log(this.q)
      // 需要判断 当清空的时候 不能发送请求 但是要把联想的建议清空
      this.timer = setTimeout(async () => {
        if (!this.q) {
          // 如果这时 搜索关键字没有内容
          this.suggestList = []
          // 不能再继续了
          return
        }
        const data = await getSuggestion({ q: this.q })
        this.suggestList = data.options
      }, 300)
      // 2.-------------节流
    }
  },
  methods: {
    //   删除历史记录
    delHistory (index) {
      // 删除
      this.historyList.splice(index, 1)
      //   同步到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 点击历史记录跳转到结果页
    toSearch (q) {
      // 路由传参，params query 两种
      //   this.$router.push('/search/result?q=' + q) //query传参
      this.$router.push({
        path: '/search/result',
        // query: { q: q }
        query: { q }
      })
    },
    // 清空历史记录
    async clear () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确定？删除？'
        })
        this.historyList = []
        localStorage.setItem(key, '[]')
      } catch (error) {}
    },
    // 搜索跳转
    onSearch () {
      //   console.log(1)
      if (!this.q) return
      this.historyList.unshift(this.q) // 将搜索内容加到历史记录
      //   数组去重
      this.historyList = Array.from(new Set(this.historyList)) // 去重
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 设置本地缓存
      this.$router.push({
        path: '/search/result',
        // query: { q: q }
        query: { q: this.q }
      })
    },
    // 联想的点击跳转到结果页面
    toResult (q) {
      console.log(q)

      this.historyList.unshift(q) // 将搜索内容加到历史记录
      //   数组去重
      this.historyList = Array.from(new Set(this.historyList)) // 去重
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 设置本地缓存
      this.$router.push({
        path: '/search/result',
        // query: { q: q }
        query: { q }
      })
    }
  },
  created () {
    //   读取历史数据
    // this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
