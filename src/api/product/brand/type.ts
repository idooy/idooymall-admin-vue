/**
 * 新增或者修改表单数据模型
 */
export interface BrandRelTableData {
    brandId: string
    id?:string
    categoryId:string
    brandName?:string
    categoryName?:string
}

/**
 * 定义品牌下拉框数据结构
 */
export interface BrandOptionData{
    brandId:number,
    brandName:string
}

/**
 * 新增或者修改表单数据模型
 */
export interface BrandCMForm {
    brandId: string
    name: string
    logo: string
    brandDescribe: string
    firstLetter: string
    sort: string
    showStatus: string
}



/**
 * 分页查询检索请求数据
 */
export interface BrandQueryPageForm {


    name: string
    showStatus: number | string

}

/**
 * 列表展示
 */
export interface BrandTableData {
    brandId: string
    name: string
    logo: string
    brandDescribe: string
    showStatus: string
    firstLetter: string
    sort: string
}

/**
 * 分页查询结果集
 */
export interface BrandTablePage {
    totalCount: number
    pageSize: number
    totalPage: number
    currentPage: number
    list: BrandTableData[]
}
export interface BrandRelTablePage {
    totalCount: number
    pageSize: number
    totalPage: number
    currentPage: number
    list: BrandRelTableData[]
}