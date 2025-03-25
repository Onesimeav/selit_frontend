import { createRouter, createWebHistory } from 'vue-router'

const adminRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path:'',
      name:'home',
      component: ()=>import('../views/admin/HomeView.vue'),
      children:[
        {
          path:'',
          name:'template',
          component:()=>import('../views/admin/TemplatesView.vue'),
          children:[
            {
              path:'',
              name:'template-list',
              component : ()=>import('../components/admin/Dashboard/Templates/TemplatesComponent.vue')
            }
          ]
        },
        {
          path:'withdrawals',
          name:'withdrawals',
          component:()=>import('../views/admin/WithdrawalsView.vue')
        },
        {
          path:'/settings',
          name:'settings',
          component:()=>import('../views/admin/SettingsView.vue')
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:()=>import('../views/admin/LoginView.vue')
    }
  ]
})

export default adminRouter;
