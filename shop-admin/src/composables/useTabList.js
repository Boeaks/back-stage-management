import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';


export function useTabList() {
  const cookie = useCookies()
  const route = useRoute()
  const router = useRouter()

  const activeTab = ref(route.path)
  const tabList = ref([
    {
      title: '首页',
      path: '/',
    }
  ])
  // 同步显示
  function addTabs(tab) {
    let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
    if (noTab) {
      tabList.value.push(tab)
    }
    // 存储到 cookie
    cookie.set("tabList", tabList.value)
  }
  function init() {
    let tab = cookie.get("tabList")
    if (tab) tabList.value = tab
  }
  init()

  // 实现标签导航跳转
  const changeTab = (e) => {
    router.push(e)
  }

  // 路由路径监听
  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path
    addTabs({
      title: to.meta.title,
      path: to.path
    })
  })

  // 关闭所有
  const closeTab = (e) => {
    switch (e) {
      case 'closeOther':
        tabList.value = tabList.value.filter(item => item.path === '/' || item.path === activeTab.value)
        break;
      case 'closeAll':
        tabList.value = [
          {
            title: '首页',
            path: '/',
          }
        ]
        changeTab('/')
        break;
    }
    cookie.set('tabList', tabList.value)
  }

  // 关闭标签导航，自动跳转下一个标签
  const removeTab = (targetName) => {
    let tabs = tabList.value  // 标签组
    let a = activeTab.value  // 当前标签
    if (a == targetName) {
      tabs.forEach((tab, index) => {
        if (tab.path == targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            a = nextTab.path
            changeTab(a)
          }
        }
      })
    }
    activeTab.value = a
    tabList.value = tabs.filter(item => item.path !== targetName)
    cookie.set('tabList', tabList.value)
  }
  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    closeTab
  }
}