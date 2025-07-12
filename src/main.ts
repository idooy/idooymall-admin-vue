/**创建VUE实例=== top */
import { createApp } from 'vue'
import App from '@/App.vue'
const app = createApp(App)
/**创建VUE实例=== bottom */

/**element-plus=== top */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 安装elementplus
app.use(ElementPlus,{
  // 国际化配置
  locale: zhCn,
})
/**element-plus=== bottom */

/**elementplus icons全局注册===== top*/
// element-plus/icons 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
/**elementplus icons全局注册===== bottom*/


//引入模板的全局样式
import '@/assets/styles/index.scss'
// svg插件
import 'virtual:svg-icons-register'

/**注册全局组件===top */
// import globalComponent from '@/plugin/registry_component'
// app.use(globalComponent)
/**注册全局组件===bottom */

/**全局路由守卫===top */
import '@/permisstion'
/**全局路由守卫===bottom */
/**vue-router===top */
import {router} from '@/router/index.ts'
app.use(router)
/**vue-router===bottom */

/**pinia===top */
import { createPinia } from 'pinia'
// 创建一个pinia实例
const pinia = createPinia()
app.use(pinia)
/**pinia===bottom*/



app.mount('#app')
    