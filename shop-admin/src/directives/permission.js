import store from "@/store"
// 判断是否有该权限
function hasPermission(value, el = false) {
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，例如 v-permission="['getStatistics3,GET']"`)
  }
  // 删除无权限的 dom 节点
  // const hasAuth = value.findIndex(v => store.state.user.ruleName.includes(v)) !== -1
  const hasAuth = store.state.user.ruleName.includes(value) !== -1
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el)
  }
  return hasAuth
}
export default {
  install(app) {
    // 自定义指令 permission
    app.directive('permission', {
      mounted(el, binding) {
        hasPermission(binding.value, el)
      },
    })
  }
}
