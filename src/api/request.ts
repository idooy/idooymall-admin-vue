//进行axios二次封装，使用请求和响应拦截器
import { request } from '@/axios.ts'
import { ElMessage } from 'element-plus'
import { userModuleStore, localStorageTokenKey } from '@/store/user.ts'


//请求拦截器
request.interceptors.request.use((config) => {
  const user_store = userModuleStore()
  // 如果token存在就放到请求头中
  const token = user_store.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
//3 响应拦截器
request.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  if (response.data.code === 2000) {
    // 成功：响应状态码和业务状态码双重验证
    return Promise.resolve(response.data.data)
  } else {
    let msg = response.data.message
    if (msg) {
      ElMessage({
        type: 'error',
        message: msg
      })
    }
    return Promise.reject(response)
  }
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error && error.response) {
    const { status } = error.response
    if (status === 401) {
      ElMessage({
        type: "error",
        plain: true,
        message: "登录过期，请重新登录"
      })
      // token 过期处理
      localStorage.removeItem(localStorageTokenKey)
      window.location.href = '/login'; // 重定向到登录页面
    } else {
      ElMessage({
        type: "error",
        message: "服务器内部错误，请联系管理员"
      })
    }
  }
  return Promise.reject(error);
}
)


//对外暴露
export default request
