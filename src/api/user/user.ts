import request from '@/utils/request.ts'
import type {
    userInfoResponseData,
    userListResponseData
} from '@/api/user/type'

enum API {
    USER_RESOURCE_URL = '/users'
}

/**
 * request header 中携带了token
 * @returns userInfoResponseData
 */
export const reqUserInfo = (uid:number) => {
    return request.get<any, userInfoResponseData>(`${API.USER_RESOURCE_URL}/${uid}`)
}
/**
 * 查询系统用户分页数据
 * @param data 
 * @returns 
 */
export const reqUserList =(pageNum:number,pageSize:number)=>{
    return request.get<any,userListResponseData>(`${API.USER_RESOURCE_URL}/${pageNum}/${pageSize}`)
}

