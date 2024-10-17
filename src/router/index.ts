import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/shop/HomeView.vue'
import DashboardHomeView from '@/views/dashboard/DashboardHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'*',
      name:'shop',
      component:HomeView
    },
    {
      path: '/',
      name: 'home',
      component: DashboardHomeView
    },

    {
      path:'/category',
      name:'category',
      component: () => import('../views/shop/CategoryView.vue')
    }
  ]
})

router.beforeEach((to,from,next)=>{
  const subdomain=window.location.host.split('.')[0];
  const domain = 'selit';
  const pageToLoad = 'shop';

  if (subdomain!==domain && to.name!==pageToLoad)
  {
    next({name:pageToLoad});
  }else{
    next();
  }
})

export default router
