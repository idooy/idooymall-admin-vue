
/**
 * 节点拖拽完成以后，需要个后台提交的表单数据
 */
export interface CategoryDropForm{
    catId:string
    parentCid:string
    sort:number
    catLevel:number
}

/**
 * 新增和修改提交的表单数据
 */
export interface CategoryCMForm {
    catId:string
    name: string
    parentCid: string
    catLevel: number
}


/**
 * el-tree需要的数据结构
 */
export interface CategoryTreeData {
    catId: string,
    name: string
    parentCid: string
    catLevel: number
    showStatus: number
    sort: number
    icon: string
    productUnit: string
    productCount: number
    children: CategoryTreeData[]
} 