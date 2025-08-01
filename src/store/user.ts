import { defineStore } from "pinia";
import { asyncRoutes } from '@/router/routes.ts'
import { reqUserInfo } from '@/api/acl/user'
import { reqLogout } from '@/api/acl/user/login';

const CONSTANT = {
    LOCAL_STORE_TOKEN_KEY: 'user_token',
    USER_STORE_NAME: 'user_store'
}
export const localStorageTokenKey = CONSTANT.LOCAL_STORE_TOKEN_KEY
// 创建一个名为 user_store 的仓库，返回的是一个函数
export const userModuleStore = defineStore(CONSTANT.USER_STORE_NAME, {

    // 为了完整类型推理，推荐使用箭头函数
    state: () => {
        return {
            // 所有这些属性都将自动推断出它们的类型
            // 初始化是登录成功后直接给的，之后的每次都从本地存储中获取
            token: localStorage.getItem(CONSTANT.LOCAL_STORE_TOKEN_KEY) || '',
            username: '',
            userId: 0,
            menuRoutes: asyncRoutes,
            avatar: ''
        }
    },
    // actions 属性它们也是定义业务逻辑的完美选择，相当于组件中的 method
    actions: {
        async registryToken(token: string) {
            this.token = token
            localStorage.setItem(CONSTANT.LOCAL_STORE_TOKEN_KEY, token)
        },
        async userInfo() {
            //获取用户信息存储仓库中：用户头像，名字,0表示获取当前登录用户信息
            // const result: userInfoResponseData = await reqUserInfo(0)
            await reqUserInfo(0).then(result => {
                this.username = result.username
                this.avatar = result.avatar
            })
        },
        // 登出 所要处理的逻辑，方法必须同步执行
        async userLogout() {
            await reqLogout()
            // 先删除本地存储
            localStorage.removeItem(CONSTANT.LOCAL_STORE_TOKEN_KEY),
                //再删除token
                this.token = ''
        }

    }
})

