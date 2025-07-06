/**
 * https://cn.vuejs.org/guide/reusability/plugins.html
 * 1、插件 (Plugins) 是一种能为 Vue 添加全局功能的工具代码
 * 2、插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：其中一种就是：通过 app.component()注册一到多个全局组件。
 * 
 */
// import {svgIcon} from '@/components/svg_icon.vue'
// import { App, Component } from 'vue'

// 如果想把自定义组件注册为全局组件，就应该添加为该对象的属性
// const globalComponents:Component= {
//     'svgIcon':svgIcon
// }


// 暴露自定义插件对象
// export default{
//     install(app:App){
//         Object.keys(globalComponents).forEach((key)=>{
//             console.log(globalComponents)
//             app.component(key,globalComponents[key])
//         })
//     }
// }