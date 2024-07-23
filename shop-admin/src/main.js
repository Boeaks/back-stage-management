import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from './store'
import 'virtual:windi.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus)
// 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 导入验证文件
import './permission'
// 进度条
import 'nprogress/nprogress.css'
// 权限按钮
import permission from './directives/permission'
app.use(permission)

app.mount('#app')
