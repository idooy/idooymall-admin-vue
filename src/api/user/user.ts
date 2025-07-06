import request from '@/utils/request.ts'
import type {userInfoResponseData} from '@/api/user/type'

enum API {
    USERINFO_URL = '/user/info'
}

/**
 * request header 中携带了token
 * @returns userInfoResponseData
 */
export const reqUserInfo = () => {
    return request.get<any, userInfoResponseData>(API.USERINFO_URL)
}

