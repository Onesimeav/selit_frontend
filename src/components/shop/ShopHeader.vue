<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Orders from '@/components/shop/Orders.vue'
import SearchBar from '@/components/shop/SearchBar.vue'
import { useShopStore } from '@/stores/shop/shops'
import type { Shop } from '@/models/shop'
import { useOrderStore } from '@/stores/shop/orders'

const isSearchBarBlack = ref(true);
const shopStore = useShopStore();
const shop = ref<Shop|null>(null);
const orderStore = useOrderStore();
const ordersId = ref<number[]>();
const handleScroll = () => {
  const navbar = document.getElementById('navbar');
  const bgImage = document.getElementById('header-background-image');
  const navbarChild = document.getElementById('navbarChild');
  const defaultSearch = document.getElementById('default-search')
  if (navbar && bgImage && navbarChild && defaultSearch) {
    if (window.scrollY>=navbar.offsetHeight){
      navbarChild.classList.add('hidden')
      navbar.classList.add('bg-white');
      bgImage.classList.add('remove-bg-image');
    }
    if(window.scrollY<defaultSearch.offsetTop){
      navbar.classList.remove('bg-white');
      bgImage.classList.remove('remove-bg-image');
      navbarChild.classList.remove('hidden');
    }
  }
}
const getOrders = ()=>{
  if (orderStore.ordersId){
    ordersId.value= orderStore.ordersId
  }
}
onMounted(()=> {
  window.addEventListener('scroll', handleScroll);
  shop.value=shopStore.shop;
  getOrders();
  watch(() => shopStore.shop, (newShop) => {
    shop.value = newShop;
  });
})

watch(()=>orderStore.ordersId,(newOrdersIds)=>{
  if (newOrdersIds) ordersId.value=newOrdersIds;
})

onUnmounted(()=>{
  window.removeEventListener('scroll', handleScroll);
})
</script>

<template>
  <nav id="navbar" class="sticky -top-0.5 z-40 transition-colors duration-300 drop-shadow-md">
    <div id="header-background-image" class="relative py-2.5 bg-center bg-cover h-full w-full" :style="{backgroundImage:`url(${shop?.banner})` } ">
      <div id="navbarChild" class="container">
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="relative z-10 flex justify-end px-2.5">
        </div>

        <div class=" relative z-10 grid grid-cols-8 items-center ">
          <div class=" col-span-7 m-4 pl-16 flex flex-col items-center">
            <img class=" w-32 h-32 rounded-full opacity-100" v-if="shop" :src="shop.logo" alt="Shop Logo">
            <h1 class="font-sora font-extra-bold text-4xl text-white ">{{shop?.name}}</h1>
          </div>
          <!-- Modal toggle -->
          <div class="col-span-1 flex flex-col items-start justify-start h-full">
            <button data-modal-target="default-modal" data-modal-toggle="default-modal" class="text-white bg-white/60 hover:bg-white/80 focus:outline-none font-medium rounded-full p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
              <svg class="w-6 h-6 text-black dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="5" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
              </svg>

            </button>
          </div>

        </div>
      </div>
      <div id="default-search" class=" relative z-10">
        <SearchBar :black-version="isSearchBarBlack" v-if="shop?.name" :shop-name="shop.name"/>
      </div>
    </div>
    <div v-if="ordersId">
      <Orders v-if="ordersId.length>=1" :orders-count="ordersId.length"/>
    </div>


  </nav>

  <!-- Main modal -->
  <div id="default-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Terms of Service
          </h3>
          <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 space-y-4">
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
          </p>
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
          </p>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
          <button data-modal-hide="default-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .bg-white {
    background-color: white !important;
  }
  .remove-bg-image{
    background-image: none !important;
  }

</style>
