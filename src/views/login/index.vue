<template>
  <div class="container">
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 登录布局 -->
    <!-- 外层需要用cell-group组件来包裹提供 边框 -->
    <van-cell-group>
      <!-- 登录手 机号 -->
      <van-field
        @blur="checkMobile"
        :error-message="errorMessage.mobile"
        v-model.trim="loginForm.mobile"
        label="手机号"
        placeholder="请输入手机号"
      ></van-field>
      <!-- 验证码 -->
      <van-field
        @blur="checkCode"
        :error-message="errorMessage.code"
        v-model.trim="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <!-- 插槽内容 -->
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login-box">
      <van-button type="info" round size="small" @click="login" block>登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        mobile: '',
        code: ''
      },
      // 此对象专门放置消息
      errorMessage: {
        mobile: '', // 手机的错误消息
        code: '' // 验证码的错误消息
      }
      //   mobileMessage: '', // 手机的提示消息
      //   codeMessage: '' // 验证码的提示消息
    }
  },
  methods: {
    // 定义检查手机号方法
    checkMobile () {
      //  获取手机号 判断 是否为空  满足手机号的格式
      if (!this.loginForm.mobile) {
        // 表示为空
        this.errorMessage.mobile = '手机号不能为空'
        // 此时表示没有不要再往下进行了
        return false // 返回一个false  false表示 此轮校验没通过 如果通过了 返回true
      }
      // 第二轮 手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 如果手机号不满足正则
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 如果到了这个位置 说明校验通过
      this.errorMessage.mobile = '' // 因为通过了 就没有消息了
      return true
    },
    // 检查验证码
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须为6位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    // 登录校验
    login () {
      //  校验手机号和验证码
      if (this.checkMobile() && this.checkCode()) {
        // 如果两个检查都是true 就表示通过 了校验
        console.log('校验通过')
      }
    }
  }
}
</script>

<style>
.login-box {
  padding: 20px;
}
</style>
