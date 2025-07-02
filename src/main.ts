import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from '@/App.vue'


const app = createApp(App)


// 安装elementplus
app.use(ElementPlus,{
  // 国际化配置
  locale: zhCn,
})
// svg插件
import 'virtual:svg-icons-register'
// 安装自定义插件
import globalComponent from '@/components/inject.component.plugin'
app.use(globalComponent)



app.mount('#app')
    