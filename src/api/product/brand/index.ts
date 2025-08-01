import request from '@/api/request'
import { BrandQueryPageForm,BrandTablePage,BrandCMForm } from '@/api/product/brand/type'

enum API{
    URL='/product/brands'
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
export const reqBrandTableData =(param:BrandQueryPageForm)=>{
    return request.get<any,BrandTablePage>(`${API.URL}/${param.currentPage}/${param.pageSize}`,{params:param.queryForm})
}

/**
 *  批量删除指定id的商品品牌
 * @param ids
 * @returns 
 */
export const reqDelBatchBrand=(ids:number[])=>{
    return request.delete(`${API.URL}`,{data:ids})
}

