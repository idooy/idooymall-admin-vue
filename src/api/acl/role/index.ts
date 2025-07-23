import request from '@/api/request'
import { RoleQueryPage,RoleTablePage,RoleCMForm } from '@/api/acl/role/type'

enum API{
    ROLES_URL='/roles'
}

/**
 * 给角色重新分配权限
 * @param roleId 角色id
 * @returns 
 */
export const reqRefreshRoleOfPermission = (roleId:number,menuIds:number[]) =>{
    return request.post<any,number[]>(`${API.ROLES_URL}/${roleId}/permission`,menuIds)
}


/**
 * 拿到当前角色所持有的权限id集合
 * @param roleId 角色id
 * @returns 
 */
export const reqRoleOfPermissionId = (roleId:string) =>{
    return request.get<any,number[]>(`${API.ROLES_URL}/${roleId}/permission`)
}

/**
 * 修改
 * @param param 
 * @returns 
 */
export const reqModifyRole =(param:RoleCMForm)=>{
    return request.put<any,RoleTablePage>(`${API.ROLES_URL}`,param)
}

/**
 * 新增
 * @param param 
 * @returns 
 */
export const reqSaveRole =(param:RoleCMForm)=>{
    return request.post<any,RoleTablePage>(`${API.ROLES_URL}`,param)
}

/**
 * 查询列表数据
 * @param param 
 * @returns 
 */
export const reqTableData =(param:RoleQueryPage)=>{
    return request.get<any,RoleTablePage>(`${API.ROLES_URL}/${param.currentPage}/${param.pageSize}`,{params:param.queryForm})
}

/**
 *  删除指定id的角色
 * @param id 
 * @returns 
 */
export const reqDelRole=(id:string)=>{
    return request.delete(`${API.ROLES_URL}/${id}`)
}