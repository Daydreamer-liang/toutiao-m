// 专门处理token的 读写和删除
const USER_TOKEN = 'wan-wu-jie-dai-ma'

// 设置
export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))// 后面只能是字符串
}
// 获取
export function getUser () {
  // 后面只能是字符串
  // JSON.parse里面是空的会报错 我们判断下
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || ' {}')// 短路表达式 ||
}
// 删除
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
