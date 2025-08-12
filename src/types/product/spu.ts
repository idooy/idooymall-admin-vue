import { type PaginationData } from "@/types/PaginationData";


export interface SpuQueryParam{
    categoryId:string,
    key:string
}



export interface SpuTableData{
    id: number;
    spuName: string;
    spuDescription: string;
    categoryId: number;
    brandId: number;
    weight: number;
    publishStatus: number;
    createTime: Date;
    updateTime: Date;
}

export type SpuTableDataList = SpuTableData[]
// 分页数据结构
export type SpuPageData = PaginationData<SpuTableData>