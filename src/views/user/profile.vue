<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link title="名称" value="用户名称" @click="showName=true" />
      <!-- 性别-点击-弹出 -->
      <van-cell is-link title="性别" value="男" @click="showGender=true" />
      <van-cell is-link title="生日" value="2019-08-08" />
    </van-cell-group>

    <!-- 弹层组件 -头像-->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>

    <!-- 弹昵称 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <van-button block type="info" size="normal" @click="btnName">确定</van-button>
    </van-popup>

    <!-- 性别弹层 =>van-action-sheet -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 控制头像弹出，
      showPhoto: false,
      //   弹昵称
      showName: false,
      //   显示性别
      showGender: false,
      //   显示性别-中的选项
      actions: [{ name: '男' }, { name: '女' }],
      //   控制生日弹出
      showBirthDay: false,
      // 最小时间
      minDate: new Date(1990, 1, 1),
      // 生日最大时间 永远是小于等于当前时间的
      maxDate: new Date(),
      // 当前时间
      currentDate: new Date(),
      //   昵称-错误的信息
      nameMsg: '',
      // 放置个人资料信息
      user: {
        // 用户昵称
        name: '',
        // 性别默认值
        gender: 1,
        // 生日默认值
        birthday: '',
        // 用户头像
        photo: ''
      }
    }
  },
  methods: {
    //   昵称
    btnName () {
      // 控制昵称的长度
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        //   告诉用户 昵称错误
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        // 不能够再继续
        return
      }
      //   将错误信息清空、
      this.nameMsg = ''
      //   关闭弹窗
      this.showName = false
    },
    //   性别
    selectItem () {}
  }
}
</script>

<style>
</style>
