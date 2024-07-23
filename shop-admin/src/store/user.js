import { getInfo, login } from '@/api/manager';
import { removeToken, setToken } from '@/composables/auth';

const user = {
  state: () => ({
    // 用户信息
    user: {},

    // 侧边栏宽度
    asideWidth: '250px',

    // 菜单 权限
    menus: [],
    ruleName: []
  }),
  mutations: {
    // 记录用户信息
    SET_USERINFO(state, user) {
      state.user = user
    },
    // 展开/收起菜单栏
    SET_ASIDEWHIDTH(state) {
      state.asideWidth = state.asideWidth === '250px' ? '64px' : '250px'
    },
    // 菜单数据
    SET_MENUS(state, menus) {
      state.menus = menus
    },
    SET_RULENAME(state, rulename) {
      state.ruleName = rulename
    }
  },
  actions: {
    // 登录接口请求
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login(username, password).then(res => {
          setToken(res.token)
          resolve(res)
        }).catch(err => reject(err))
      })
    },
    // 用户信息接口请求
    getInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          commit('SET_USERINFO', res)
          commit('SET_MENUS', res.menus)
          commit('SET_RULENAME', res.ruleNames)
          resolve(res)
        }).catch(err => reject(err))
      })
    },
    // 退出登录
    logout({ commit }) {
      // 清除 state 中用户信息
      commit('SET_USERINFO', {})
      // 清除 cookie
      removeToken()
    }
  }
}

export default user