/**注册自定义全局组件 */
import Svg from '@/components/SvgIcon.vue'
import { App, Component } from 'vue'

// 如果想把自定义组件注册为全局组件，就应该添加为该对象的属性
const globalComponents: Component= {Svg}


// 暴露自定义插件对象
export default{
    install(app: App){
        Object.keys(globalComponents).forEach((key)=>{
            app.component(key,globalComponents[key])
        })
    }
}