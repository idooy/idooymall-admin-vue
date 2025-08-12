import request from '@/api/request'
import {SpuPageData, SpuQueryParam} from '@/types/product/spu'

const API = {
    url:'/product/spus'
}

/**
 * 查询spu列表数据
 * @param currentPage 
 * @param pageSize 
 * @param param 
 * @returns 
 */
export const reqTableList=(currentPage:number,pageSize:number,param:SpuQueryParam)=>{
    let url = `${API.url}/${currentPage}/${pageSize}`
    return request.get<any,SpuPageData>(url,{params:param})
}