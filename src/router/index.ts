/**
 * 在这里创建一个vue-router实例对象
 * 1、路由器实例是通过调用 createRouter() 函数创建的
 * 2、一旦创建了我们的路由器实例，我们就需要将其注册为插件，这一步骤可以通过调用 use() 来完成。
 *    createApp(App).use(router).mount('#app')
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import {constantRoutes,asyncRoutes} from '@/router/routes.ts'

/**
 * 访问路由器和当前路由，你很可能想要在应用的其他地方访问路由器。
 * 1、如果你是从 ES 模块导出路由器实例的，你可以将路由器实例直接导入
 * 到你需要它的地方。在一些情况下这是最好的方法，但如果我们在组件
 * 内部，那么我们还有其他选择。在组件模板中，路由器实例将被暴露为 
 * $router。这与同样被暴露的 $route 一样，但注意前者最后有一个额外的 r。
 * 
 * 2、对于组合式 API，我们不能通过 this 访问组件实例，
 * 所以 Vue Router 给我们提供了一些组合式函数。演练场
 * 示例中的 AboutView.vue 组件使用了这种方法：
 * 
 * import { useRoute, useRouter } from 'vue-router'
 * const router = useRouter() // 即由 createRouter() 返回的对象就是 router 路由器实例
 * const route = useRoute() // 自然useRoute()返回的对象就是 route 路由实例
 * 
 * 
 * 3、Vue Router 可以使用组合式 API 或选项式 API，如果你对于这两种风格不熟悉，可以参考 Vue - API 风格。
 * https://cn.vuejs.org/guide/introduction#api-styles
 * 
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes:[...constantRoutes,...asyncRoutes]
})