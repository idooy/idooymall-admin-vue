import request from '@/api/request'
import { QueryAttrGroupForm,TablePage,AttrGroupTableData } from '@/api/product/attr/type'

enum Api{
    ATTR_GROUP_URL='/product/attr/groups'
}




/**
 * 查询属性分组列表数据
 * @param param 
 */
export const reqAttrGroupTableData =(currentPage:Number,pageSize:number,param:QueryAttrGroupForm)=>{
    const reqUrl = `${Api.ATTR_GROUP_URL}/${currentPage}/${pageSize}`
    return request.get<any,TablePage>(reqUrl,{params:param})
}
/**
 * 删除
 * @param param 
 */
export const reqBatchDelete =(ids:string[])=>{
    return request.delete<any,void>(`${Api.ATTR_GROUP_URL}`,{data:ids})
}
/**
 * 新增属性分组列表数据
 * @param param 
 */
export const reqCreateAttrGroup =(param:AttrGroupTableData)=>{
     return request.post<any,void>(`${Api.ATTR_GROUP_URL}`,param)
}
/**
 * 修改属性分组列表数据
 * @param param 
 */
export const reqModifyAttrGroup =(param:AttrGroupTableData)=>{
    return request.put<any,void>(`${Api.ATTR_GROUP_URL}`,param)
}


