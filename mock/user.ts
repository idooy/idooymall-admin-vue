// mock/user.ts

enum USER_API{
    GET_USER_URL='/user/info'
}


export const createUserList = () => {
    return [
        {
            userId: 1,
            avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            username: 'admin',
            password: '123456',
            desc: '下船不谈船里事',
            roles: ['平台管理员'],
            buttons: ['cuser.detail'],
            routes: ['home'],
            token: 'Admin Token'
        },
        {
            userId: 2,
            avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            username: 'system',
            password: '123456789',
            desc: '旧人不谈近况，新人不讲过往',
            roles: ['系统管理员'],
            buttons: ['cuser.detail', 'cuser.user'],
            routes: ['home'],
            token: 'Admin Token'
        }
    ]
}

export default [
    // 获取用户信息接口
    {
        url: USER_API.GET_USER_URL,
        method: 'get',
        response: (request: any) => {
            // 获取请求头携带的 token
            const token = request.headers.token
            // 查看用户信息数据中是否包含有此 token 的用户
            const checkUser = createUserList().find((item) => item.token === token)
            // 没有就返回失败信息
            if (!checkUser) {
                return {
                    code: 2001,
                    data: {
                        message: '获取用户信息失败'
                    }
                }
            }
            // 有就返回成功信息
            return {
                code: 2000,
                data: checkUser
            }
        }
    }
]