/**
 * 主要就是在路由守卫中实现某些功能
 * 1、路由鉴权，由全局前置导航守卫完成；
 * 2、路由跳转‘进度条’，由全局前/后置导航守卫共同完成
 * 3、给浏览器的tab页添加title
 * 
 */
import { router } from '@/router'

//Add nprogress.js and nprogress.css to your project.
// https://www.npmjs.com/package/nprogress
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//剔除加载过程中的‘转圈圈’
nprogress.configure({ showSpinner: false })

//如何在组件外使用store:https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html
import { userModuleStore } from '@/store/user.ts'


/**
 * 全局前置守卫，可以使用 router.beforeEach 注册一个全局前置守卫：
 * 
 * 每个守卫方法接收两个参数：
 *  to: 即将要进入的目标 
 *  from: 当前导航正要离开的路由 
 * 
 * 可以返回的值如下:
 *
 *  false: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，
 *         那么 URL 地址会重置到 from 路由对应的地址。
 *  一个路由地址: 通过一个路由地址重定向到一个不同的地址，如同调用 router.push()，且
 *               可以传入诸如 replace: true 或 name: 'home' 之类的选项。它会中断当
 *               前的导航，同时用相同的 from 创建一个新导航。
 * 如果遇到了意料之外的情况，可能会抛出一个 Error。这会取消导航并且调用 router.onError() 注册过的回调。
 * 如果什么都没有，undefined 或返回 true，则导航是有效的，并调用下一个导航守卫
 * 以上所有都同 async 函数 和 Promise 工作方式一样
 * 
 * 
 * 可选的第三个参数 next
 * 在之前的 Vue Router 版本中，还可以使用 第三个参数 next 。这是一个常见的错误来源，
 * 我们经过 RFC 讨论将其移除。然而，它仍然是被支持的，这意味着你可以向任何导航守卫传
 * 递第三个参数。在这种情况下，确保 next 在任何给定的导航守卫中都被严格调用一次。
 */
router.beforeEach((to: any, from: any, next: any) => {
  // 浏览器tab页的title
  document.title = to.meta.title
  //路由跳转的同时，进度条开始工作，在路由成功跳转完成以后的后置钩子中进度条需要手动终止
  nprogress.start()

  // ✅路由导航中获取store，这样做是可行的，因为路由器是在其被安装之后开始导航的，
  // 而此时 Pinia 也已经被安装。
  const userStore = userModuleStore()
  const token = userStore.token
  const username = userStore.username
  const avatar = userStore.avatar

  // 这些都是去登录页面的路由
  const toLoginRoute = to.path == '/login' || to.path == '/index' || to.path == '/';
  // 如果跳转登录页面的路由，就得分‘已登录’和‘未登录’
  if (toLoginRoute) {
    // 已登录:路由跳转；哪来的回哪
    if (token) {
      next({ path:from.path})
    } else {
      // 未登录：放行
      next()
    }

  }else{
    // 跳转的路由地址是‘非登录页的路由地址’的情况
    if(token){
      // 如果登录成功放行
      next()
    }else{
      // 如果没有成功登录就引导用户先登录
        next({path:'/login'})
    }  
   
  }  
})

//全局后置守卫
router.afterEach((to: any, from: any, next: any) => {
  // 进度条结束
  nprogress.done()
})


