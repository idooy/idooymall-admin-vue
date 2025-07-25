import request from '@/api/request'
import type {
    userInfoResponseData,
    UserTablePageData,
    UserCMForm
} from '@/api/acl/user/type'

import {RoleTableData} from '@/api/acl/role/type'

enum API {
    USER_RESOURCE_URL = '/users'
}



/**
 * 提交用户分配到的角色
 * @param roleId 角色id
 * @returns 
 */
export const reqSubmitUserOfRoles = (userId:string,roleIds:number[]) =>{
    return request.put(`${API.USER_RESOURCE_URL}/${userId}/roles`,roleIds)
}

/**
 * 获取用户所拥有角色
 * @param roleId 角色id
 * @returns 
 */
export const reqUserOfRole = (userId:string) =>{
    return request.get<any,number[]>(`${API.USER_RESOURCE_URL}/${userId}/roles`)
}


/**
 * 批量删除
 * @param ids 
 * @returns 
 */
export const reqDeleteUser = (ids:Array<string>)=>{
    return request.delete(`${API.USER_RESOURCE_URL}`,{data:ids})
}

/**
 *  修改用户数据
 * @param userData 
 * @returns 
 */
export const reqModifyUser = (userData:UserCMForm)=>{
    return request.put(`${API.USER_RESOURCE_URL}`,userData)
}


/**
 * 添加用户信息
 * @param userData 
 * @returns 
 */
export const reqAddUser = (userData:UserCMForm)=>{
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
    return request.get<any,UserTablePageData>(
        `${API.USER_RESOURCE_URL}/${pageNum}/${pageSize}`,
        {
            params:{
                username
            }
        }
    )
}

