/***************
 * 登录注册相关接口
 */
import request from '@/http/index.js'

export const register = (data) => {
    console.log("===> 注册的参数: {}",data)
    return request({
        url: '/register',
        method: 'post',
        data
    })
}
