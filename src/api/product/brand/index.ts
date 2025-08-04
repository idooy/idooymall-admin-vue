import request from '@/api/request'
import { BrandQueryPageForm,BrandTablePage,BrandCMForm,BrandRelTablePage,BrandRelTableData } from '@/api/product/brand/type'

enum API{
    URL='/product/brands',
    REL_URL='/product/brands/relations'
}

/**
 * 添加品牌关联的分类信息
 * @param param 
 * @returns 
 */
export const reqSaveBrandRel =(data:BrandRelTableData)=>{
    const url = `${API.REL_URL}`
    return request.post<any,void>(url,data)
}
/**
 * 查询品牌关联的分类信息
 * @param param 
 * @returns 
 */
export const reqCategoryByBrandId =(currentPage:number,pageSize:number,brandId:number)=>{
    const url = `${API.REL_URL}/${currentPage}/${pageSize}`
    return request.get<any,BrandRelTablePage>(url,{params:{brandId}})
}
/**
 * 删除品牌与分类的关联数据
 * @param param 
 * @returns 
 */
export const reqDelBrandRel =(id:number[])=>{
    return request.delete(`${API.REL_URL}`,{data:id})
}
/**
 * 批量删除品牌数据
 * @param param 
 * @returns 
 */
export const reqDelBrand =(ids:number[])=>{
    return request.delete(`${API.URL}`,{data:ids})
}

/**
 * 修改
 * @param param 
 * @returns 
 */
export const reqModifyBrand =(param:BrandCMForm)=>{
    return request.put(`${API.URL}`,param)
}

/**
 * 新增
 * @param param 
 * @returns 
 */
export const reqSaveBrand =(param:BrandCMForm)=>{
    return request.post(`${API.URL}`,param)
}

/**
 * 查询列表数据
 * @param param 
 * @returns 
 */
export const reqBrandTableData =(currentPage:number,pageSize:number,param:BrandQueryPageForm)=>{
    return request.get<any,BrandTablePage>(`${API.URL}/${currentPage}/${pageSize}`,{params:param})
}

/**
 *  批量删除指定id的商品品牌
 * @param ids
 * @returns 
 */
export const reqDelBatchBrand=(ids:number[])=>{
    return request.delete(`${API.URL}`,{data:ids})
}

