<template>
  <div class="container">
    <!-- 头-导航  采用vant组件-->
    <!-- 底部-标签栏 -->
    <!-- 1.导航 -->
    <!-- <van-nav-bar title="高仿一今日头晕"  right-text="搜索"> -->
    <van-nav-bar title="高仿一今日头晕" fixed v-if="$route.path !== '/user'">
      <van-icon @click="$router.push('/search')" class="icon" name="search" slot="right" />
    </van-nav-bar>
    <!-- 2.中间放一级路由的容器 -->
    <div class="my-wrapper" :class="{noTop : $route.path === '/user'}">
      <!-- 组件缓存-当我们跳到别的页面-在回来，原来的页面销毁了，重新加载，这在移动端是不可原谅的 -->
      <!-- 我们直接包裹二级路由 进行缓存 -->
      <keep-alive>
        <!-- 一旦被包裹，路由容器里的组件，就不会被销毁 -->
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 3.底部-标签栏 -->
    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="search">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .icon {
    font-size: 25px;
  }
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
