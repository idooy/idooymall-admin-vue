

// 查询系统用户需要检索的条件
export interface userListRequestData {
  username: string
}


// 系统用户列表查询响应的数据结构
export interface userListResponseData {
  page: {
    totalCount: number,
    pageSize: number,
    totalPage: number,
    currPage: number,
    list: userList
  }

}

/**
 * 列表展示的每个用户数据
 */
export interface userData {
  userId: 1,
  username: string,
  email: string,
  mobile: string,
  status: string,
  avatar: string,
  createUserId: string,
  createTime: string
}
export type userList = userData[]

//用户登录携带参数ts类型
export interface loginFormData {
  username: string
  password: string
}


//用户信息返回的数据类型
export interface userInfoResponseData {
  userId: string
  routes: string[]
  buttons: string[]
  roles: string[]
  username: string
  avatar: string
}
