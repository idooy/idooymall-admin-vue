/**
 * 属性和分组关联：只有基本属性才和分组进行关联
 */
import request from '@/api/request'
import { AttrData } from '@/types/product/attr'

const URL = 'product/attr/group/relations'


/**
 * 删除属性与属性分组的关联关系
 * @param attrGroupId 
 * @returns 
 */
export const  reqBatchSaveRelationAttr=(batchData:AttrData[])=>{
    return request.post(`${URL}/multi`,batchData)
}

/**
 * 删除属性与属性分组的关联关系
 * @param attrGroupId 
 * @returns 
 */
export const  reqDelAttrAttrGroupRelation=(batchData:any[])=>{
    return request.delete(URL,{data:batchData})
}
/**
 * 拿到指定分组下的所有基本属性数据
 * @param attrGroupId 
 * @returns 
 */
export const  reqAttrGroupOfRelationAttr=(attrGroupId:number)=>{
    return request.get(URL,{params:{attrGroupId}})
}