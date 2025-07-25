

// 查询系统用户需要检索的条件
export interface userListRequestData {
  username: string
}


// 系统用户列表查询响应的数据结构
export interface UserTablePageData {
  totalCount: number,
  pageSize: number,
  totalPage: number,
  currentPage: number,
  list: UserTableData[]
}
interface User{
  userId: string,
  userAccount: string,
  email: string,
  mobile: string,
  avatar: string,
}

export interface UserCMForm extends User{
  userStatus: number
}
/**
 * 列表展示的每个用户数据
 */
export interface UserTableData extends User{
  userStatus: {key:number,text:string},
  creator: string,
  createTime: string,
  updateTime:string
}


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

export interface userAddModifyFormData {
  username: string,
  email: string,
  mobile: string
}