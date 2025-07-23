/**
 * 新增或者修改表单数据模型
 */
export interface RoleCMForm {
    roleId?: string
    roleName: string
    remark: string
    status: string
}



/**
 * 分页查询检索请求数据
 */
export interface RoleQueryPage {
    pageSize: number
    currentPage: number
    queryForm: {
        roleName: string
        remark: string
        status: string
    }
}

/**
 * 列表展示
 */
export interface RoleTableData {
    roleId: string
    roleName: string
    remark: string
    status: {
        key: string
        text: string
    }
    creator: string
    createTime: string
    updataTime: string
}

/**
 * 分页查询结果集
 */
export interface RoleTablePage {
    totalCount: number
    pageSize: number
    totalPage: number
    currentPage: number
    list: RoleTableData[]
}