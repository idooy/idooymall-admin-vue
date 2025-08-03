import { router } from '@/router'
import { ElMessage } from 'element-plus'
// https://www.npmjs.com/package/nprogress
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//剔除加载过程中的‘转圈圈’
nprogress.configure({ showSpinner: false })

//如何在组件外使用store:https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html
//里边明确给出“在 Vue Router 的导航守卫中使用 store 的例子”。
import { userModuleStore } from '@/store/user.ts'
// import { storeToRefs } from 'pinia'


// 路由前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {

  // 浏览器tab页的title
  document.title = to.meta.title
  //路由跳转的同时，进度条开始工作，在路由成功跳转完成以后的后置钩子中进度条需要手动终止
  nprogress.start()
  // 这就是pinia官方给出在路由导航中正确调用 useStore() 的地方
  const userStore = userModuleStore()
  const token = userStore.token
  const username = userStore.username
  const avatar = userStore.avatar


  // 未登录状态可以访问的路由
  const anonymousUrl = ['/login']

  if (!token) {// 用户未登录，只能访问匿名的路由
    if (anonymousUrl.includes(to.path)) {// 访问的是匿名路由就放行
      next()
    } else { // 访问的不是匿名路由,得强制跳转到‘/login'
      // ElMessage({
      //   message: '请进行登录~',
      //   type: 'error',
      //   plain: true,
      // })
      // 把用户打算前往的路由给‘/login’带上，如果用户登录成功直接跳转曾经想去的路由
      // next({ path: "/login" })
      next({ path: "/login", query: { redirect: to.path } })
    }
  } else {// 用户登录成功
    if (to.path == '/login') { //不能访问‘/login’进行重复登录操作
      ElMessage({
        message: '请勿重复登录~',
        type: 'error',
        plain: true,
      })
      // 哪里来回哪里去，不知道从哪里来就回‘/home’
      next({ path: from.path ? from.path : "/home" })
    }else{// 用户登录成功，跳转‘非/login'的任意路由
      // 防止路由跳转、浏览器刷新丢失用户数据
      if(username!='' && avatar!=''){
        next() // 有用户信息再放行
      }else{ // 没有用户信息就去请求
        userStore.userInfo()
        next()
      }
    }
  }
})

//全局后置守卫
// router.afterEach((to: any, from: any, next: any) => {
router.afterEach(() => {
  // 进度条结束
  nprogress.done()
})


