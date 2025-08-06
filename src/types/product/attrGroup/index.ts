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

// 属性分组下拉框
export interface AttrGroupOption{
    attrGroupName:string
    attrGroupId:number
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

/**
 * 查询分组还没有被关联的属性，所需要的请求参数都封装到这里
 */
export interface QueryNotRelationParam{
    currentPage:number
    pageSize:number
    attrGroupId:number
    key:string
}

export interface RelationIncrForm{
    attrId:number,
    attrGroupId:number
}