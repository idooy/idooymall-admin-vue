/**注册自定义全局组件，比如SvgIcon组件注册为全局之后，就可以在项目中直接使用组件标签，而不需要每次局部import*/
import SvgIcon from '@/components/SvgIcon.vue'
import { App, Component } from 'vue'

// 如果想把自定义组件注册为全局组件，就应该添加为该对象的属性
const globalComponents: Component= {SvgIcon}


// 暴露自定义插件对象
export default{
    install(app: App){
        Object.keys(globalComponents).forEach((key)=>{
            app.component(key,globalComponents[key])
        })
    }
}