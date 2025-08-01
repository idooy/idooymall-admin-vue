import request from '@/api/request'

enum API {
    PUBLIC_KEY_URL = '/admin/rsa/pubkey'
}

/**
 * 获取rsa公钥，在登录请求之前需要对密码进行加密
 * @returns 
 */
export const reqPubKey = ()=>{
    return request.get<any,string>(API.PUBLIC_KEY_URL)
}

