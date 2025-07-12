//进行axios二次封装，使用请求和响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
//引入用户仓库
import {userModuleStore} from '@/store/user.ts'

//1 利用axios对象的create方法，创建axios实例：配置基础路径，超时时间
const request = axios.create({

  //基础路径
  baseURL: import.meta.env.VITE_SERVE_URL,
  timeout: 5000,
})
//2 request 实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //获取用户相关的小仓库：token,登录成功后携带给服务器
    const userStore = userModuleStore()
    // 如果登录成功需要携带token在请求头中
    if (userStore.token) {
      config.headers.Authorization =`Bearer ${userStore.token}` 
    }

  //config配置对象，headers属性请求头，经常给服务器端携带公共参数
  //返回配置对象
  return config
})
//3 响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调，响应状态码和业务状态码双重验证
    if (response.status === 200 && response.data.code === 2000) {
      return Promise.resolve(response.data.data)
    } else {
      let msg = response.data.message
      ElMessage({
        type: 'warning',
        message: msg
      })
      return Promise.reject(response)
    }
  }, (error) => {
    // 对响应错误做点什么
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求';
          break;
        case 401:
          error.message = '未授权，请重新登录';
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = '请求错误,未找到该资源';
          break;
        case 405:
          error.message = '请求方法未允许';
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器端出错';
          break;
        case 501:
          error.message = '网络未实现';
          break;
        case 502:
          error.message = '网络错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网络超时';
          break;
        case 505:
          error.message = 'http版本不支持该请求';
          break;
        default:
          error.message = `未知错误${error.response.status}`;
      }
    } else {
      error.message = "连接到服务器失败";
    }
    ElMessage({
      type: "error",
      message: error.message
    })

    return Promise.reject(error);
  }
)


//对外暴露
export default request
