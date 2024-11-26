import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import shopRouter from '@/router/shopRouter'
import dashboardRouter from './router'
import axios from 'axios'

const app = createApp(App)

const host = window.location.host;
const subdomain = host.split('.');

const router = ()=>{
  let routes;
  if (subdomain[0]==='www'){
    if (subdomain[1]===import.meta.env.VITE_DOMAIN_NAME){
      routes= dashboardRouter;
    }else{
      routes=shopRouter;
    }
  }else if(subdomain[0]===import.meta.env.VITE_DOMAIN_NAME){
    routes = dashboardRouter;
  }else {
    routes= shopRouter;
  }
  return routes;
}
app.config.globalProperties.$axios = axios;
axios.defaults.baseURL='https://selit-backend.onrender.com/api/v1';
app.use(createPinia())
app.use(router())
app.mount('#app')
