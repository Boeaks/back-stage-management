// 处理权限验证相关
import { router, addRoutes } from '@/router'
import { getToken } from './composables/auth'
import { toast, showLoading, hidenLoading } from './composables/util'
import store from './store'
let hasGetInfo = false
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const token = getToken()
  showLoading()
  // 未登录
  if (!token && to.path != '/login') {
    toast('请先登录', 'error')
    return next({ path: '/login' })
  }
  // 已登录
  if (token && to.path == '/login') {
    toast('请勿重复登录', 'error')
    return next({ path: from.path ? form.path : '/' })
  }
  // 如果用户已登录，自动获取用户信息，并存储到 vuex 中
  let isNewRouter = false
  if (token && !hasGetInfo) {
    let res = await store.dispatch('getInfo')
    hasGetInfo = true
    // 动态添加路由
    isNewRouter = addRoutes(res.menus)
  }
  // 设置页面标题
  const title = (to.meta.title ? to.meta.title : '') + '-上腾商城后台'
  document.title = title
  // 最后一定需要放行
  isNewRouter ? next(to.fullPath) : next()
})

// 全局后置守卫
router.afterEach((to, from) => {
  hidenLoading()
})
