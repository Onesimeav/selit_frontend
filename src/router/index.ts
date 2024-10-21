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
  ]
})

export default dashboardRouter
