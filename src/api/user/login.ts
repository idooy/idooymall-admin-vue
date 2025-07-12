import request from '@/utils/request.ts'
import type {
    loginFormData
} from '@/api/user/type'

enum API {
    LOGIN_API = '/login',
    LOGOUT_URL = '/logout',
    PUBLIC_KEY_URL = '/rsa/pubkey'
}

/**
 *  登录
 * @param data 表单数据
 * @returns loginResponseData
 */
export const reqLogin = (data: loginFormData) => {
    return request.post<any, string>(API.LOGIN_API, data)
}

/**
 * 获取rsa公钥，在登录请求之前需要对密码进行加密
 * @returns 
 */
export const reqPublicKey = ()=>{
    return request.get<any,string>(API.PUBLIC_KEY_URL)
}

/**
 * 用户退出登录，还是根据request header中的token来确认用户身份
 * @returns 
 */
export const reqLogout = () => {
    return request.post<any, any>(API.LOGOUT_URL)
} 