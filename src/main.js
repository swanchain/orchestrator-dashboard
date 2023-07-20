import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/index.css'
import en from 'element-plus/es/locale/lang/en'
import commonFun from '@/utils/common'
import './assets/js/world.js'

const app = createApp(App)
app.config.globalProperties.$commonFun = commonFun
app.use(ElementPlus, {
        locale: en,
    })
    .use(i18n)
    .use(store)
    .use(router)
app.mount('#app')