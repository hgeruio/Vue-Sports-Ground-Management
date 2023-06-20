import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
import axios from 'axios'
import VueCookies from 'vue-cookies'




const app = createApp(App)
app.use(router).use(store).use(VueCookies)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


axios.defaults.baseURL = '/api'


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 鉴权token , 给头部带上token
  if (localStorage.getItem('token')) {
    config.headers.token = localStorage.getItem('token')
    console.log(config.headers.token)
  }
  return config
}, error => {
  return Promise.reject(error.data.error.message)
})