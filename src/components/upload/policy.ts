/**
 * 
 * 文件上传至oss,采用服务端验签web端直传的方式，该文件请求验签信息
 */

import request from '@/api/request.ts'
import { PolicyData } from '@/components/upload/type'

enum Api {
    POLICY_URL='/thirdparty/oss/policy'
}

/**
 *  获取oss直传的验签信息
 * @returns 
 */
export const policy = ()=>{
    return request.get<any,PolicyData>(`${Api.POLICY_URL}`)
}
