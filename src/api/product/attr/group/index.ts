import request from '@/api/request'
import { QueryAttrGroupForm,TablePage,AttrGroupTableData,AttrGroupOption, QueryNotRelationParam,AttrGroupWithAttrList} from '@/types/product/attrGroup'
import {AttrRelationPageData} from '@/types/product/attr'
enum Api{
    ATTR_GROUP_URL='/product/attr/groups'
}




/**
 * 查询属性分组还没有被关联的基本属性列表数据
 * @param param 
 */
export const reqQueryNotRelationAttr =(params:QueryNotRelationParam)=>{
    let attrGroupId = params.attrGroupId
    const reqUrl = `${Api.ATTR_GROUP_URL}/${attrGroupId}/not/relation`
    return request.get<any,AttrRelationPageData>(reqUrl,{params:{
        currentPage:params.currentPage,
        pageSize:params.pageSize,
        key:params.key
    }})
}
/**
 * 查询指定分类下的属性分组以及关联的属性
 * @param param 
 */
export const reqGroupWithAttrByCategoryId =(categoryId:number)=>{
    const reqUrl = `${Api.ATTR_GROUP_URL}/${categoryId}/withAttr`
    return request.get<any,AttrGroupWithAttrList>(reqUrl)
}
/**
 * 查询指定分类下的属性分组列表
 * @param param 
 */
export const reqAttrGroupListByCategoryId =(categoryId:number)=>{
    const reqUrl = `${Api.ATTR_GROUP_URL}`
    return request.get<any,AttrGroupOption[]>(reqUrl,{params:{categoryId}})
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


