/***************
 * 登录注册相关接口
 */
import request from '@/http/index.js'

export const login = (data) => {
    console.log("===>  登录的参数: {}", data)
    return request({
        url: '/login',  //请求后端的url【接口地址】
        method: 'post',
        data    //发送到后端的请求参数【默认json】
    })
}
