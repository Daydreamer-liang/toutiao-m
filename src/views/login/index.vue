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
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      loginForm: {
        mobile: '17720022477',
        code: '246810'
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
    ...mapMutations(['updateUser']),
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
    async login () {
      //  校验手机号和验证码
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      // if (this.checkMobile() && this.checkCode()) 之所以不这么写 ，是因为页面初始化，验证码不校验，所以
      // 前面都先执行一遍校验的代码，在判断
      if (validateMobile && validateCode) {
        //   同步
        // console.log(1)
        try {
          const result = await login(this.loginForm)
          this.updateUser({ user: result }) // 相当于更新当前的token 和 refresh_token
          // 1 判断是否有需要跳转的页面 如果有 就跳转 如果没有 不用管 直接跳到主页
          const { redirectUrl } = this.$route.query // query查询参数 也就是 ?后边的参数表
          // redirectUrl有值的话 跳到该地址 没值的话 跳到 主页
          this.$router.push(redirectUrl || '/') // 短路表达式
        } catch (error) {
          //   this.$notify({ message: '用户名或者验证码错误', duration: 800 })
          // utils/Plugin 是我们一些常用的函数 $notify 被我们封装 为$gnotify
          this.$gnotify({ message: '用户名或者验证码错误' })
        }
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
