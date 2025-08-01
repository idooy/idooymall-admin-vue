import request from '@/api/request'
import type {CategoryCMForm, CategoryTreeData} from '@/api/product/categories/type'
import { dataType } from 'element-plus/es/components/table-v2/src/common.mjs'


enum API {
    CATEGORIES_API = '/product/categories'
}

/**
 *  el-tree修改节点信息
 */
export const reqModifyCategory = (data:CategoryCMForm) => {
    return request.put(`${API.CATEGORIES_API}`,data)
}
/**
 *  el-tree新增节点信息
 */
export const reqCreateCategory = (data:CategoryCMForm) => {
    return request.post(`${API.CATEGORIES_API}`,data)
}
/**
 *  el-tree删除节点
 */
export const reqBatchDel = (ids:number[]) => {
    return request.delete(`${API.CATEGORIES_API}`,{data:ids})
}

/**
 *  el-tree数据源
 */
export const reqDataSourceTree = () => {
    return request.get<any,CategoryTreeData[]>(`${API.CATEGORIES_API}/tree`)
}