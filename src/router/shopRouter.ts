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
      path:'/category/:name/:id',
      name:'category',
      component: ()=> import('../views/shop/CategoryView.vue'),
    },

    {
      path:'/product/:id',
      name:'product-details',
      component:()=>import('../views/shop/ProductDetailsView.vue'),
    },
    {
      path:'/cart',
      name:'cart',
      component:()=>import('../views/shop/CartView.vue'),
    },

    {
      path:'/orders',
      name:'orders',
      component:()=>import('../views/shop/OrdersView.vue'),
    },
    {
      path:'/order/:id',
      name:'order-details',
      component:()=>import('../views/shop/OrderDetailsView.vue'),
    },

    {
      path:'/404',
      component:()=>import('../views/shop/404.vue'),
    }
  ]
})

export default shopRouter;
