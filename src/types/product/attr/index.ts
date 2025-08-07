import { AttrGroupOption } from "../attrGroup"

/**
 * 后端给的‘列表数据结构’和‘属性详情数据结构’都是该类型
 */
export interface AttrTableData {
    attrId: number,
    attrName: string,
    searchType: number,
    icon: string,
    valueSelect: string[],
    valueType: number,
    attrType: number,
    enable: number,
    categoryId: number,
    showDesc: number,
    catalogName: string,
    attrGroupId: number | string,
    attrGroupName: string,
    catalogPath: number[],
    attrGroupList:AttrGroupOption[]
}
/**
 * 商品属性
 *
 * Attr
 */
export interface AttrData {
    /**
     * 属性id
     */
    attrId?: number;
    /**
     * 属性名
     */
    attrName?: string;
    /**
     * 属性类型[0-销售属性，1-基本属性]
     */
    attrType?: number;
    /**
     * 所属分类
     */
    categoryId?: number;
    /**
     * 启用状态[0 - 禁用，1 - 启用]
     */
    enable?: number;
    /**
     * 属性图标
     */
    icon?: string;
    /**
     * 是否需要检索[0-不需要，1-需要]
     */
    searchType?: number;
    /**
     * 快速展示【是否展示在介绍上；0-否 1-是】，在sku中仍然可以调整
     */
    showDesc?: number;
    /**
     * 可选值列表[用逗号分隔]
     */
    valueSelect?: string;
    /**
     * 0:只允许单个值，1:允许多个值
     */
    valueType?: number;
    
}


// 列表查询字段
export interface QueryAttrForm {

    key: string
    categoryId: string

}


/**
 * 分页查询结果集
 */
export interface AttrTablePageData {
    totalCount: number
    pageSize: number
    totalPage: number
    currentPage: number
    list: AttrTableData[]
}

/**
 * 分页查询结果集
 */
export interface AttrRelationPageData {
    totalCount: number
    pageSize: number
    totalPage: number
    currentPage: number
    list: AttrData[]
}