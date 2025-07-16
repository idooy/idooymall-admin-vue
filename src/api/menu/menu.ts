import request from "@/api/request";
import { MenuListData } from "@/api/menu/type";

const API = {
    QUERY_CHILDREN_URL:'/menus/tree'
}

/**
 * 查询系统所有菜单以及对应的按钮，tree数据结构
 * @param pid 父菜单的id
 * @returns 
 */
export const reqAllMenuButtonTree =()=>{
    return request.get<any,MenuListData[]>(API.QUERY_CHILDREN_URL)
}