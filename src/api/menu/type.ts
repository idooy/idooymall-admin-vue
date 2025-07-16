

export interface MenuListData{
    menuId:number
    parentId:number
    name:string
    url:string
    type:number
    icon:string
    children: MenuListData[]
}

// 新增/修改菜单的表单数据
export interface MenuForm {
    menuId?:number,
    parentId?:number,
    name:string,
    url?:string,
    icon?:string,
    type?:number
}