
export type PaginationData<T> = {
    totalCount: number
    pageSize: number
    totalPage: number
    currentPage: number
    list: T[]
}