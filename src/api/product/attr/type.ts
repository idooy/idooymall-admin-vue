export interface AttrGroupTableData {
    attrGroupId: string
    attrGroupName: string
    sort: string
    attrDesc: string
    icon: string
    catalogId: string
    catalogPath?: string[]// 级联选择器选择的分类层级ID
}
// 列表查询字段
export interface QueryAttrGroupForm {

    key: string
    categoryId: string

}


/**
 * 分页查询结果集
 */
export interface TablePage {
    totalCount: number
    pageSize: number
    totalPage: number
    currentPage: number
    list: AttrGroupTableData[]
}