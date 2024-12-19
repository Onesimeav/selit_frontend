import { createRouter, createWebHistory } from 'vue-router'
import DashboardHomeView from '@/views/dashboard/DashboardHomeView.vue'

const dashboardRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardHomeView
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
