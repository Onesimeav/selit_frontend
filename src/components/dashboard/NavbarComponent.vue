<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'
import { initFlowbite } from 'flowbite'
import { useUserStore } from '@/stores/dashboard/user'
import type { User } from '@/models/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore();
  const user = ref<User>()
  const router = useRouter();
  const tabs = ref({
   dashboard: {url:'/',name:'Dashboard'},
    shop: {url:'/shop',name:'Boutiques'},
    order: {url:'/order',name:'Commandes'},
    product: {url:'/product',name:'Produits'},
    promotion: {url:'/promotion',name:'Promotions'},
    category: {url:'/category',name:'Categories'},
    setting:{url:'/setting',name:'Paramètres'},
  })
  const currentPage = ref('Dashboard');

  const redirectTo = (page:{url:string,name:string})=>{
    if (page === tabs.value.dashboard){
      currentPage.value = page.name;
      router.push(page.url);
    }else{
      currentPage.value = page.name;
      router.push(page.url);
    }

  }

  const logout = async()=>{
    if (await userStore.logoutUser()){
      await router.push('/login')
    }else{
      console.log(userStore.errorMessage);
    }
  }

onMounted(()=>{
  if(userStore.currentUser){
    user.value=userStore.currentUser
  }
  initFlowbite();
});

watch(()=>userStore.currentUser,(newUser)=>{
  if (newUser){
    user.value=newUser;
  }
})
</script>

<template>


  <nav class="fixed top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="px-3 py-7 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
          </button>
          <p class="lg:pl-80 pl-1 flex font-poppins font-bold text-heading-1">{{currentPage}}</p>
        </div>
        <div class="flex items-center">
          <div class="flex items-center mr-3 ms-3">
            <div class="flex justify-between items-center ">
              <button type="button" class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                <span class="sr-only">Open user menu</span>
                <span class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                </span>
              </button>
              <span class="pl-2">
                    <p v-if="user" class="font-rubik font-bold text-normal-text">{{user.name}}</p>
                    <p class="font-rubik font-normal text-appGray text-normal-text">Admin</p>
              </span>
            </div>
            <div class="z-40 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
              <div v-if="user" class="px-4 py-3" role="none">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                  {{user.email}}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <aside id="logo-sidebar" class="fixed top-0 left-0 z-50 w-64 h-screen pt-4 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
    <div class="h-full px-6 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <div class="flex items-center pl-4 pb-8 justify-start rtl:justify-end">
        <a href="/" class="flex">
          <img src="@/assets/selit-logo.png" class="h-[9vh] w-full" alt="Selit Logo" />
        </a>
      </div>
      <ul class="space-y-2 font-medium">
        <li>
          <button type="button" @click="redirectTo(tabs.dashboard)" :class="currentPage==tabs.dashboard.name?'text-appBlue':'text-gray-900'" class="flex items-center w-full p-2  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.dashboard.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.dashboard.name" src="@/assets/home-icon-blue.svg" alt="home-icon-blue">
            <img v-else src="@/assets/home-icon.svg" alt="home-icon">
            <span class="ms-3 ">Dashboard</span>
          </button>
        </li>
        <li>
          <button type="button" @click="redirectTo(tabs.shop)" :class="currentPage==tabs.shop.name?'text-appBlue':'text-gray-900'" class="flex items-center w-full p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.shop.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.shop.name" src="@/assets/shop-icon-blue.svg" alt="shop-icon">
            <img v-else src="@/assets/shop-icon.svg" alt="shop-icon">
            <span class="ms-3 ">Boutiques</span>
          </button>
        </li>
        <li>
          <button type="button" @click="redirectTo(tabs.order)" :class="currentPage==tabs.order.name?'text-appBlue':'text-gray-900'" class="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.order.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.order.name" src="@/assets/order-icon-blue.svg" alt="order-icon">
            <img v-else src="@/assets/order-icon.svg" alt="order-icon">
            <span class="ms-3">Commandes</span>
            <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
          </button>
        </li>
        <li>
          <button type="button" @click="redirectTo(tabs.product)" :class="currentPage==tabs.product.name?'text-appBlue':'text-gray-900'" class="flex items-center w-full p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.product.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.product.name" src="@/assets/product-icon-blue.svg" alt="product-icon">
            <img v-else src="@/assets/product-icon.svg" alt="product-icon">
            <span class="ms-3">Produits</span>
          </button>
        </li>
        <li>
          <button type="button" @click="redirectTo(tabs.promotion)" :class="currentPage==tabs.promotion.name?'text-appBlue':'text-gray-900'" class="flex items-center w-full p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.promotion.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.promotion.name"  src="@/assets/promotion-icon-blue.svg" alt="promotion-icon">
            <img v-else  src="@/assets/promotion-icon.svg" alt="promotion-icon">
            <span class="ms-3">Promotions</span>
          </button>
        </li>
        <li>
          <button type="button" @click="redirectTo(tabs.category)" :class="currentPage==tabs.category.name?'text-appBlue':'text-gray-900'" class="flex items-center w-full p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.category.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.category.name" src="@/assets/category-icon-blue.svg" alt="category-icon">
            <img v-else src="@/assets/category-icon.svg" alt="category-icon">
            <span class="ms-3">Catégories</span>
          </button>
        </li>

        <li>
          <button type="button" @click="redirectTo(tabs.setting)" :class="currentPage==tabs.setting.name?'text-appBlue':'text-gray-900'" class=" flex items-center w-full p-2 mt-40 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.setting.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.setting.name" src="@/assets/setting-icon-blue.svg" alt="setting-icon">
            <img v-else src="@/assets/setting-icon.svg" alt="setting-icon">
            <span class="ms-3">Paramètres</span>
          </button>
        </li>
        <li>
          <button type="button" @click="logout" class="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <img src="@/assets/logout-icon.svg" alt="setting-icon">
            <span class="ms-3">Déconnexion</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>

</style>
