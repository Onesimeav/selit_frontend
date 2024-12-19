import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import shopRouter from '@/router/shopRouter'
import dashboardRouter from './router'
import axios from 'axios'
import { useRouter } from 'vue-router'


const app = createApp(App)

const host = window.location.host;
const subdomain = host.split('.');
let isDashboard : boolean = false;
const router = ()=>{
  let routes;
  if (subdomain[0]==='www'){
    if (subdomain[1]===import.meta.env.VITE_DOMAIN_NAME){
      routes= dashboardRouter;
      isDashboard = true;
    }else{
      routes=shopRouter;
    }
  }else if(subdomain[0]===import.meta.env.VITE_DOMAIN_NAME){
    routes = dashboardRouter;
    isDashboard = true;
  }else {
    routes= shopRouter;
  }
  return routes;
}
app.use(createPinia())
app.use(router())
app.config.globalProperties.$axios = axios;
axios.defaults.baseURL='https://selit-backend.onrender.com/api/v1';
if (isDashboard){
  axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if (token){
    config.headers.Authorization= `Bearer ${token}`;
    }
    return config;
  })

  axios.interceptors.response.use(
    (response)=> response,
    async (error) => {
      const { response } = error
      if (response && response.data.message == 'Unauthenticated') {
        const router = useRouter();
        await router.push('/login');
      }
      return Promise.reject(error);
    }
  )
}
app.mount('#app')
