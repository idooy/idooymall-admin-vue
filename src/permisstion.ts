/**
 * 主要就是在路由守卫中实现某些功能
 * 1、路由鉴权，由全局前置导航守卫完成；
 * 2、路由跳转‘进度条’，由全局前/后置导航守卫共同完成
 * 3、给浏览器的tab页添加title
 * 
 */
import { router } from '@/router'
import { ElMessage } from 'element-plus'
//Add nprogress.js and nprogress.css to your project.
// https://www.npmjs.com/package/nprogress
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//剔除加载过程中的‘转圈圈’
nprogress.configure({ showSpinner: false })

//如何在组件外使用store:https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html
import { userStore } from '@/store/user.ts'


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
router.beforeEach(async (to: any, from: any, next: any) => {

  // 浏览器tab页的title
  document.title = to.meta.title
  //路由跳转的同时，进度条开始工作，在路由成功跳转完成以后的后置钩子中进度条需要手动终止
  nprogress.start()
  const user_tore = userStore()
  const token = user_tore.token
  const username = user_tore.username
  const avatar = user_tore.avatar
  
  // '/' ===》'/login'
  if (!token && from.path == '/' && to.path == '/login') {
    return next()
  }
  //没有登录，强制跳转回去进行登录
  if (!token && to.path != '/login') {
    ElMessage({
      message: '请先进行登录~',
      type: 'error',
      plain: true,
    })
    return next({ path: '/login' })
  }
  // 防止重复登录
  if (token && to.path == '/login') {
    ElMessage({
      message: '请勿重复登录~',
      type: 'error',
      plain: true,
    })
    return next({ path: from.path ? from.path : "/home" })
  }
  next()
  // 防止路由跳转、浏览器刷新丢失用户数据
  if (!username || !avatar) {
    await user_tore.userInfo()
  }



  // // 用户登录成功
  // if (token) {
  //   if (toLoginRoute) {
  //     // 还得判断从哪个路由来的，如果从登录页到登录页，那就去home
  //     // 如果从非登录页去往登录页，那就哪来的的会哪
  //     let fromPath = from.path;
  //     if (!anonymousUrl.includes(fromPath)) {
  //       next({ path: fromPath })
  //     } else {
  //       next({ path: '/home' })
  //     }
  //   } else {
  //     //登录成功，访问除登录外的其他路由
  //     //有用户信息放行
  //     if (username.length > 0 && avatar.length > 0) {
  //       next()
  //     } else {
  //       //没有用户信息，发请求获取用户信息，再放行
  //       try {
  //         //获取用户信息后再放行
  //         await user_tore.userInfo()
  //         next()
  //       } catch (error) {
  //         //token过期：获取不到用户信息，
  //         //用户修改本地存储的token
  //         //退出登录，用户数据清空
  //         await user_tore.userLogout()
  //         next({ path: '/login' })
  //         // next({ path: '/login', query: { redirect: to.path } })
  //       }
  //     }
  //   }
  // } else { //用户未登录    
  //   if (toLoginRoute) { //用户跳转的是登录页路由，就放行
  //     next()
  //   } else { // 用户跳转非登录页路由，就指引用户去往登录页
  //     next({ path: '/login' })
  //   }
  // }
})

//全局后置守卫
// router.afterEach((to: any, from: any, next: any) => {
router.afterEach(() => {
  // 进度条结束
  nprogress.done()
})


