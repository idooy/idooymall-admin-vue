import request from "@/api/request";
import { MenuListData } from "@/api/acl/menu/type";

const API = {
    QUERY_CHILDREN_URL:'/admin/menus/tree',
    DEL_MENUS:'/admin/menus'
}

/**
 * 查询系统所有菜单以及对应的按钮，tree数据结构
 * @param pid 父菜单的id
 * @returns 
 */
export const reqAllMenuButtonTree =()=>{
    return request.get<any,MenuListData[]>(API.QUERY_CHILDREN_URL)
}

/**
 * 
 * @param id 要删除的菜单或者按钮的ID
 * @returns 
 */
export const reqDelMenusById=(id:number)=>{
    return request.delete(`${API.DEL_MENUS}/${id}`)
}