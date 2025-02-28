import "normalize.css"
import './assets/styles/main.scss'
// 注册components里面的全部组件
import installComponents from "@/plugins/installComponents"

import { createApp } from 'vue'
import App from './App.vue'

import router from "@/router"

const app = createApp(App)
app.use(router)

installComponents(app)

app.mount('#app')
