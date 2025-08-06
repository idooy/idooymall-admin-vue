import request from '@/api/request'
import { QueryAttrForm,AttrTablePageData,AttrTableData } from '@/types/product/attr'

enum Api{
    ATTR_URL='/product/attrs'
}


/**
 * id查询属性详情
 * @param param 
 */
export const reqAttrInfoData =(attrId:number)=>{
    const reqUrl = `${Api.ATTR_URL}/${attrId}`
    return request.get<any,AttrTableData>(reqUrl)
}
/**
 * 查询属性列表数据
 * @param param 
 */
export const reqAttrTableData =(currentPage:Number,pageSize:number,param:QueryAttrForm)=>{
    const reqUrl = `${Api.ATTR_URL}/${currentPage}/${pageSize}`
    return request.get<any,AttrTablePageData>(reqUrl,{params:param})
}
/**
 * 删除
 * @param param 
 */
export const reqBatchDeleteAttr =(ids:number[])=>{
    return request.delete<any,void>(`${Api.ATTR_URL}`,{data:ids})
}
/**
 * 新增属性数据
 * @param param 
 */
export const reqCreateAttr =(param:AttrTableData)=>{
     return request.post<any,void>(`${Api.ATTR_URL}`,param)
}
/**
 * 修改属性数据
 * @param param 
 */
export const reqModifyAttr =(param:AttrTableData)=>{
    return request.put<any,void>(`${Api.ATTR_URL}`,param)
}


