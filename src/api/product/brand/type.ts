/**
 * 新增或者修改表单数据模型
 */
export interface BrandCMForm {
    brandId: string
    name: string
    logo: string
    brandDescribe: string
    firstLetter: string
    sort:string
    showStatus:string
}



/**
 * 分页查询检索请求数据
 */
export interface BrandQueryPageForm {
    pageSize: number | 10
    currentPage: number | 1
    queryForm: {
        name: string
        showStatus: number | string
    }
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
    sort:string
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