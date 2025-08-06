import axios from 'axios'

//利用axios对象的create方法，创建axios实例：配置基础路径，超时时间
export const request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_SERVE_URL,
  timeout: 10000,
})