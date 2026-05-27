/*************************
 * 此js为Log.vue提供后端数据，以及把Log.vue中的数据发送到后端
 */

import request from '../http/index.js'

//定义函数

//获取日志数据
export const getLogList = (data) => {
    if(data) {
        console.log("===> 异步请求参数: {}", data)
    }
    //
    return request({
        url: '/log/list',   
        method: 'get'
    })
}
