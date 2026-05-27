import { createApp } from 'vue'
//导入应用
import App from './App.vue'
//导入路由
import router from './router'
//导入pinia
import { createPinia } from 'pinia'
//导入element-plus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
//导入element-plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入Font Awesome核心组件
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 导入图标配置文件
import '@icons/menuIcon'
import '@icons/brand'
import '@icons/commons'

// 引入 Tailwind CSS
import '@/assets/css/tailwind.css'

//创建应用
const app = createApp(App)
//注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 注册Font Awesome组件（全局组件）
app.component('FontAwesomeIcon', FontAwesomeIcon)

//应用elementplus, router, pinia
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(router)
app.use(createPinia())
//挂载应用
app.mount('#app')

// 在组件中确保导入了必要的模块
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'


// // 测试可删
// import Vue from 'vue'
// // element ui 完全引入
// import ElementUI from 'element-ui'
// // import '@/assets/css/element-variables.scss'
// // import '@/assets/css/style.scss'
// // 加载路由
// // import router from '@/router/router-static.js';
// // import router from '@/router/router-static.js';
// // 面包屑导航，注册为全局组件
// import BreadCrumbs from '@/components/common/BreadCrumbs'
// // 引入echart
// import echarts from 'echarts'
// // 引入echart主题
// // import  '@/assets/js/echarts-theme-macarons.js'
// import 'echarts/theme/macarons.js'
// // ajax
// import http from '@/utils/http.js'
// // 基础配置
// import base from '@/utils/base'
// // 工具类
// import { isAuth } from '@/utils/utils'
// // storage 封装
// import storage from "@/utils/storage";
// // 上传组件
// import FileUpload from "@/components/common/FileUpload";
// // 富文本编辑组件
// import Editor from "@/components/common/Editor";
// // api 接口
// import api from '@/utils/api'
// // 数据校验工具类
// import * as validate from '@/utils/validate.js'
// // 后台地图
// import VueAMap from 'vue-amap'
// import '@/icons'
// //excel导出
// import JsonExcel from 'vue-json-excel'

// // 后台地图
// Vue.use(VueAMap)
// VueAMap.initAMapApiLoader({
//     key: 'ca04cee7ac952691aa67a131e6f0cee0',
//     plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geocoder'],
//     // 默认高德 sdk 版本为 1.4.4
//     v: '1.4.4'
// })
// Vue.prototype.$validate = validate
// Vue.prototype.$http = http // ajax请求方法
// Vue.prototype.$echarts = echarts
// Vue.prototype.$base = base.get()
// Vue.prototype.$project = base.getProjectName()
// Vue.prototype.$storage = storage
// Vue.prototype.$api = api
// // 判断权限方法
// Vue.prototype.isAuth = isAuth
// // Vue.prototype.$base = base
// Vue.use(ElementUI, { size: 'medium', zIndex: 3000 });
// Vue.config.productionTip = false
// // 组件全局组件
// Vue.component('bread-crumbs', BreadCrumbs)
// Vue.component('file-upload', FileUpload)
// Vue.component('editor', Editor)
// //excel导出
// Vue.component('downloadExcel', JsonExcel)
// new Vue({
//     render: h => h(App),
//     router
// }).$mount('#app')

