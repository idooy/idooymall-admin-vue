import request from '@/api/request'
import type {
    userInfoResponseData,
    userListResponseData,
    userAddModifyFormData
} from '@/api/acl/user/type'

enum API {
    USER_RESOURCE_URL = '/users'
}


export const reqDeleteUser = (ids:Array<string>)=>{
    return request.delete(`${API.USER_RESOURCE_URL}`,{data:ids})
}

/**
 *  修改用户数据
 * @param userData 
 * @returns 
 */
export const reqModifyUser = (userData:userAddModifyFormData)=>{
    return request.put(`${API.USER_RESOURCE_URL}`,userData)
}


/**
 * 添加用户信息
 * @param userData 
 * @returns 
 */
export const reqAddUser = (userData:userAddModifyFormData)=>{
    return request.post(`${API.USER_RESOURCE_URL}`,userData)
}

/**
 * 查询指定id的用户信息，如果id=0查询当前系统用户信息
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
export const reqUserList =(pageNum:number,pageSize:number,username:string)=>{
    return request.get<any,userListResponseData>(
        `${API.USER_RESOURCE_URL}/${pageNum}/${pageSize}`,
        {
            params:{
                username
            }
        }
    )
}

