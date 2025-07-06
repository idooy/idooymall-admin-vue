import request from '@/utils/request.ts'
import type {
    loginFormData,
    loginResponseData
} from '@/api/user/type'

enum API {
    LOGIN_API = '/user/login',
    LOGOUT_URL = '/user/logout'
}

/**
 *  登录
 * @param data 表单数据
 * @returns loginResponseData
 */
export const login = (data: loginFormData) => {
    return request.post<any, loginResponseData>(API.LOGIN_API, data)
}


/**
 * 用户退出登录，还是根据request header中的token来确认用户身份
 * @returns 
 */
export const reqLogout = () => {
    return request.post<any, any>(API.LOGOUT_URL)
} 