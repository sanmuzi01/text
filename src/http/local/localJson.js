/*****************************
 * 此文件是用来加载本地的json文件，以完成静态页面的展示
 * 注：在真正完成与后端对接后，此文件就不需要调用了
 * 
 */
import axios from "axios"

const baseURL = "/" 

async function loadLocalJson(fileName) {
    try {
        const response = await axios.get(`${baseURL}${fileName}`)
        return response.data
    } catch (error) {
        console.error(`加载${fileName}时发生错误：`, error)
        throw error
    }
}

//导出
export default loadLocalJson