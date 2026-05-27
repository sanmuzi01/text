/****************
 * 使用axios封装http请求，并提供拦截器配置
 */
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import router from '@/router'  //index.js可以省略


const service = axios.create({
  baseURL: '/api',  //参考 vite.config.js中的 server.proxy.api配置
  timeout: 5000  //超时时长
})

//请求拦截器
service.interceptors.request.use(
  (config) => {
    // 考虑到后端的token验证，这里需要将token添加到请求头中
    let token = localStorage.getItem('token');
    // 判断，如果有token，则添加请到请求头中
    if (token) {
      console.log("==> 本次请求的token:{}", token)
      config.headers.Authorization = token
    }
    //
    return config;
  },
  (error) => {
    console.log("==> 本次请求出错：{}", error);
    return Promise.reject(error);
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    //判断响应头中是否包含 认证信息authorization
    if (response.headers.authorization) {
      console.log('==> 响应头中的认证信息Token:{}', response.headers.authorization)
      // 存放在本地存储中
      localStorage.setItem('token', response.headers.authorization)
    }
    if (response.status === 200) {
      console.debug('==> 响应成功，且状态码是200,通过 Promise.resolve(response)处理响应')
      return Promise.resolve(response);

    } else {
      console.warn('==> 响应成功，但状态码不是200,通过 Promise.reject(response)处理响应')
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        // 401: 未登录
        case 401:
          localStorage.removeItem('token');

          ElMessageBox.alert('未登录', '提示', {
            confirmButtonText: 'OK'
          })

          router.push({ path: '/login' });
          break
        // 403： 登录过期
        case 403:
          ElMessageBox.alert('登录过期，请重新登录', '提示', {
            confirmButtonText: 'OK'
          })
          localStorage.removeItem('token');
          router.push({ path: '/login' });
          break
        // 404: 请求不存在
        case 404:
          alert('网络请求不存在');
          break
        // 500: 服务错误
        case 500:
          alert('网络请求有误');
        default:
          alert('服务错误');
      }

    } else {
      // 配置服务器没有返回结果情况
      if (!window.navigator.onLine) {
        // 断网情况，进行断网处理
        return
      }
      console.log("response:", error);
      return Promise.reject(error);
    }
  }
)

export default service


