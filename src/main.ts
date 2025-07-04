import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入模板的全局样式
import '@/styles/index.scss'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from '@/App.vue'
// svg插件
import 'virtual:svg-icons-register'
// 安装自定义插件
import globalComponent from '@/components/inject.component.plugin'
import {router} from '@/router/index.ts'

const app = createApp(App)


// 安装elementplus
app.use(ElementPlus,{
  // 国际化配置
  locale: zhCn,
})

app.use(globalComponent)
app.use(router)


app.mount('#app')
    