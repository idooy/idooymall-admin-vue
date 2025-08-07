
/**
 * 定义路由route的地方，本应编写在index.ts文件中，现在有意单独提出成一个文件
 * 这里的 routes 选项定义了一组路由，把 URL 路径映射到组件
 */
export const constantRoutes = [

    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
            hidden: true,
            //菜单文字左侧图标，支持element-plus所有图标
            icon: 'Promotion',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404/index.vue'),
        meta: {
            title: '404访问',
            hidden: true,
            icon: 'DataLine',
        },
    }
]


export const asyncRoutes = [

    // 首页
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/layout/index.vue'),
        redirect: '/home',
        // meta: {
        //     title: '',
        //     hidden: false,
        //     icon: '',
        // },
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: 'House',
                }
            }
        ]
    },
    // 数据大屏
    {
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name: 'Screen',
        meta: {
            title: '数据大屏',
            hidden: false,
            icon: 'Platform',
        },
    },
    // 权限管理
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'acl',
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'Lock',
        },
        redirect: '/acl/user', //重定向到第一个二级路由
        children: [
            {
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'Acl',
                meta: {
                    title: '用户管理',
                    hidden: false,
                    icon: 'User',
                },
            },
            {
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    hidden: false,
                    icon: 'UserFilled',
                },
            },
            {
                path: '/acl/permission',
                component: () => import('@/views/acl/menu/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'Monitor',
                },
            },
        ],
    },
    // 商品管理
    {
        path: '/product',
        component: () => import('@/layout/index.vue'),
        name: 'Product',
        meta: {
            title: '商品管理',
            hidden: false,
            icon: 'Goods',
        },
        redirect: '/product/trademark', //重定向到第一个二级路由
        children: [
             {
                path: '/product/categories',
                component: () => import('@/views/product/categories/index.vue'),
                name: 'Categories',
                meta: {
                    title: '商品分类',
                    hidden: false, //false可以去掉
                    icon: 'ShoppingCart',
                },
            },
            {
                path: '/product/brand',
                component: () => import('@/views/product/brand/index.vue'),
                name: 'Brand',
                meta: {
                    title: '品牌管理',
                    hidden: false, //false可以去掉
                    icon: 'ShoppingCart',
                },
            },
            {
                path: '/product/attr/group',
                name: 'AttrGroup',
                component: () => import('@/views/product/attr/AttrGroup.vue'),
                meta: {
                    title: '属性分组',
                    hidden: false,
                    icon: 'Wallet',
                },
            },
            {
                path: '/product/attr/manage',
                name: 'AttrManage',
                component: () => import('@/views/product/attr/AttrManage.vue'),
                meta: {
                    title: '属性管理',
                    hidden: false,
                    icon: 'Wallet',
                },
            },
            {
                path: '/product/spu',
                name: 'Spu',
                component: () => import('@/views/product/spu/index.vue'),
                meta: {
                    title: 'SPU管理',
                    hidden: false,
                    icon: 'Present',
                },
            },
            {
                path: '/product/sku',
                name: 'Sku',
                component: () => import('@/views/product/sku/index.vue'),
                meta: {
                    title: 'SKU管理',
                    hidden: false,
                    icon: 'Suitcase',
                },
            },
        ],
    },
    // 会员管理
    {
        path: '/member',
        component: () => import('@/layout/index.vue'),
        name: 'Member',
        meta: {
            title: '会员管理',
            hidden: false,
            icon: 'Goods',
        },
        redirect: '/member/level', //重定向到第一个二级路由
        children: [
             {
                path: '/member/level',
                component: () => import('@/views/member/level/index.vue'),
                name: 'Level',
                meta: {
                    title: '会员等级',
                    hidden: false, //false可以去掉
                    icon: 'ShoppingCart',
                },
            }
        ],
    },

    
]
