import request from '@/api/request'
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
 * 用户退出登录，还是根据request header中的token来确认用户身份
 * @returns 
 */
export const reqLogout = () => {
    return request.post<any, any>(API.LOGOUT_URL)
} 