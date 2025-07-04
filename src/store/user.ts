import { defineStore } from "pinia";

const CONSTANT={
    LOCAL_STORE_TOKEN_KEY:'user_token',
    USER_STORE_NAME:'user_store'
}

// 创建一个名为 user_store 的仓库，返回的是一个函数
export const  userModuleStore = defineStore(CONSTANT.USER_STORE_NAME, {

    // 为了完整类型推理，推荐使用箭头函数
    state: () => {
        return {
            // 所有这些属性都将自动推断出它们的类型
            // 初始化是登录成功后直接给的，之后的每次都从本地存储中获取
            token: localStorage.getItem(CONSTANT.LOCAL_STORE_TOKEN_KEY)
        }
    },
    // actions 属性它们也是定义业务逻辑的完美选择，相当于组件中的 method
    actions: {
        registryToken(token:string){
            this.token = token
            localStorage.setItem(CONSTANT.LOCAL_STORE_TOKEN_KEY,token)
        }
    }
})

