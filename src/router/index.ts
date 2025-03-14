import { createRouter, createWebHistory } from 'vue-router'
import DashboardHomeView from '@/views/dashboard/DashboardHomeView.vue'
import DashboardStatsView from '@/views/dashboard/DashboardStatsView.vue'

const dashboardRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardHomeView,
      children:[
        {
          path:'',
          name:'dashboard-stats',
          component:DashboardStatsView,
        },
        {
          path:'shop',
          name:'shop',
          component:()=>import('../views/dashboard/ShopView.vue'),
          children:[
            {
              path:'',
              name:'shop-list',
              component:()=>import('../components/dashboard/ShopComponent.vue'),
            },
            {
              path:':subdomain',
              name:'shop-details',
              component:()=>import('../components/dashboard/ShopDetailsComponent.vue')
            },
            {
              path:'create',
              name:'create-shop',
              component:()=>import('../components/dashboard/CreateShopComponent.vue')
            }
          ]
        },
        {
          path:'order',
          name:'order',
          component:()=>import('../views/dashboard/OrderView.vue'),
          children:[
            {
              path:'',
              name:'order-list',
              component:()=>import('../components/dashboard/OrderComponent.vue')
            },
            {
              path:':id',
              name:'order-details',
              component:()=>import('../components/dashboard/OrderDetailsComponent.vue')
            }
          ]
        },
        {
          path:'product',
          name:'product',
          component:()=>import('../views/dashboard/ProductView.vue'),
          children:[
            {
              path:'',
              name:'product-list',
              component:()=>import('../components/dashboard/ProductComponent.vue')
            },
            {
              path:'create',
              name:'create-product',
              component:()=>import('../components/dashboard/CreateProductComponent.vue')
            },
            {
              path:'update/:id',
              name:'update-product',
              component:()=>import('../components/dashboard/UpdateProductComponent.vue')
            }
          ]
        },
        {
          path:'promotion',
          name:'promotion',
          component: () => import('../views/dashboard/PromotionView.vue'),
          children : [
            {
              path:'',
              name:'promotion-list',
              component:()=>import('../components/dashboard/PromotionComponent.vue')
            },
            {
              path:'create',
              name : 'create-promotion',
              component:()=>import('../components/dashboard/CreatePromotionComponent.vue')
            },
            {
              path:'update/:id',
              name:'update-promotion',
              component:()=>import('../components/dashboard/UpdatePromotionComponent.vue')
            },
            {
              path: ':id',
              name:'promotion-details',
              component:()=>import('../components/dashboard/PromotionDetailsComponent.vue')
            }
          ]
        },
        {
          path:'category',
          name:'category',
          component: ()=>import('../views/dashboard/CategoryView.vue'),
          children:[
            {
              path:'',
              name:'category-list',
              component:()=>import('../components/dashboard/CategoryComponent.vue'),
            },
            {
              path:'create',
              name:'create-category',
              component:()=>import('../components/dashboard/CreateCategoryComponent.vue'),
            },
            {
              path:'update/:id',
              name:'update-category',
              component:()=>import('../components/dashboard/UpdateCategoryComponent.vue'),
            },
            {
              path:':id',
              name:'category-details',
              component:()=>import('../components/dashboard/CategoryDetailsComponent.vue'),
            }
          ]
        },
        {
          path:'setting',
          name:'setting',
          component:()=>import('../views/dashboard/SettingView.vue')
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:()=>import('../views/dashboard/UserLoginView.vue'),
    },
    {
      path:'/google-callback',
      name:'google-callback',
      component:()=>import('../views/dashboard/GoogleCallback.vue'),
    },
    {
      path:'/forgot-password',
      name:'forgot-password',
      component:()=>import('../views/dashboard/ForgotPasswordView.vue'),
    },
    {
      path:'/sign-up',
      name:'sign-up',
      component:()=>import('../views/dashboard/CreateAccountView.vue')
    },
    {
      path:'/verify-user',
      name:'verify-user',
      component:()=>import('../views/dashboard/VerifyAccountView.vue')
    }
  ]
})

export default dashboardRouter
