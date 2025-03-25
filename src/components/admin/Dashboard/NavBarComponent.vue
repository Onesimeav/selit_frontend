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
  templates: {url:'/',name:'Templates'},
  withdrawals: {url:'/withdrawals',name:'Retraits'},
  setting: {url:'/setting', name:'Paramètres'},
})
const currentPage = ref('Templates');
const errorMessage = ref('');
const showErrorMessage = ref(false);

const redirectTo = (page:{url:string,name:string})=>{
  if (page === tabs.value.templates){
    currentPage.value = page.name;
    router.push(page.url);
  }else{
    currentPage.value = page.name;
    router.push(page.url);
  }

}

const logout = async()=>{
  showErrorMessage.value = false;
  if (await userStore.logoutUser()){
    await router.push('/login')
  }else{
    errorMessage.value = "Une erreur est survenue";
    showErrorMessage.value = true;
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
          <button type="button" @click="redirectTo(tabs.templates)" :class="currentPage==tabs.templates.name?'text-appBlue':'text-gray-900'" class="flex items-center w-full p-2  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.templates.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.templates.name" src="@/assets/product-icon-blue.svg" alt="template-icon-blue">
            <img v-else src="@/assets/product-icon.svg" alt="template-icon">
            <span class="ms-3 ">Templates</span>
          </button>
        </li>
        <li>
          <button type="button" @click="redirectTo(tabs.withdrawals)" :class="currentPage==tabs.withdrawals.name?'text-appBlue':'text-gray-900'" class="flex items-center w-full p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.withdrawals.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.withdrawals.name" src="@/assets/category-icon-blue.svg" alt="withdrawals-icon">
            <img v-else src="@/assets/category-icon.svg" alt="withdrawals-icon">
            <span class="ms-3 ">Retraits</span>
          </button>
        </li>

        <li>
          <button type="button" @click="redirectTo(tabs.setting)" :class="currentPage==tabs.setting.name?'text-appBlue':'text-gray-900'" class=" flex items-center w-full p-2 mt-60 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <span v-if="currentPage==tabs.setting.name"  class="border rounded-full bg-appBlue relative -start-10 h-10 w-4"></span>
            <img v-if="currentPage==tabs.setting.name" src="@/assets/setting-icon-blue.svg" alt="setting-icon">
            <img v-else src="@/assets/setting-icon.svg" alt="setting-icon">
            <span class="ms-3">Paramètres</span>
          </button>
        </li>
        <li>
          <button type="button" @click="logout" class="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <img src="@/assets/logout-icon.svg" alt="logout-icon">
            <span class="ms-3">Déconnexion</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>

</style>
