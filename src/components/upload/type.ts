/**
 * 后台响应的Web端直传时需要的验签数据
 */
export interface PolicyData {
    version:string
    policy: string,
    x_oss_credential: string,
    x_oss_date: string,
    signature: string,
    security_token: string,
    host: string,
    dir:string
}

/**
 * 上传额外携带的请求参数
 */
export interface UploadParam {
    success_action_status:string
    policy: string
    'x-oss-signature': string,
    'x-oss-signature-version':string
    'x-oss-credential': string
    'x-oss-date': string
    // 文件名；dir+fileName
    key:string,
    'x-oss-security-token': string
    // file:File
}
