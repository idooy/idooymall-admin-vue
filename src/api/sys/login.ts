import request from '@/utils/request.ts'
import {loginFormData,loginResponseData} from '@/api/sys/type.ts'

enum API{
    LOGIN_API='/sys/login'
}

// 登录
export const login = (data:loginFormData)=>{
    return request.post<any,loginResponseData>(API.LOGIN_API,data)
}

// 第二种写法
export function login_bak(data: loginFormData){
    return request.post<any,loginResponseData>(API.LOGIN_API,data)
} 