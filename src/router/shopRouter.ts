import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/shop/HomeView.vue'

const shopRouter = createRouter({
  history:createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path:'/',
      name:'Shop',
      component: HomeView
    },
    {
      path:'/category',
      name:'category',
      component: ()=> import('../views/shop/CategoryView.vue'),
    },
    {
      path:'/404',
      component:()=>import('../views/shop/404.vue'),
    }
  ]
})

export default shopRouter;
