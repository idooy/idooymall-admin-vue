
// 定义路由route的地方，本应编写在index.ts文件中，现在有意单独提出成一个文件
export const routes = [
    {path:'/',name:'Welcome',component:()=>import('@/views/login/index.vue')},
    {path:'/layout',name:'Layout',component:()=>import('@/views/layout/index.vue')}
]
