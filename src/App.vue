<template>
  <div id="app">
    <keep-alive>
      <!-- 缓存组件 $route.meta.isAlive 缓存时，生效 一级路由只缓存了layout组件-->
      <router-view v-if="$route.meta.isAlive" />
    </keep-alive>
    <!-- 不缓存时生效 -->
    <router-view v-if="!$route.meta.isAlive" />
  </div>
</template>

<style lang="less">
</style>
