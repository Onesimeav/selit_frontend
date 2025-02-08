<script setup lang="ts">
import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { Page } from '@/models/page'
import type { Product } from '@/models/product'
import { initFlowbite } from 'flowbite'
import { useDashboardShopStore } from '@/stores/dashboard/shop'
import type { Shop } from '@/models/shop'
import { useDashboardProductStore } from '@/stores/dashboard/product'

const shopStore = useDashboardShopStore();
const productStore = useDashboardProductStore();
const route = useRoute();

const shop = ref<Shop>();
const products = ref<Page<Product>>()
const page = ref<number>(1);

const getShopDetails = async()=>{
  shop.value= await shopStore.getShop(String(route.params.subdomain));
  await getShopProducts();
}

const getShopProducts = async ()=>{
  if(shop.value){
    await productStore.getProducts(undefined,shop.value.id,page.value)
    if (productStore.products){
      products.value=productStore.products
    }
  }else{
    console.log("Une erreur est survenue");
  }
}

const loadMore = async ()=>{
  page.value +=1;
  await getShopProducts();
}

const changeShopStatus= async ()=>{
  if (shop.value){
    if (await shopStore.publishShop(shop.value.id)){
      await getShopDetails();
    }else{
      console.log("Echec de l'opération")
    }
  }else{
    console.log("Une erreur est survenue");
  }

}


onMounted(async()=>{
  await getShopDetails();
  initFlowbite();
});

</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Détails de la boutique</p>
      </div>
    </div>
    <div v-if="shop">
      <div class="flex justify-end items-center mb-5">
        <button @click="changeShopStatus()" v-if="shop.publish" type="button" class="bg-green-500 rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-1">Désactiver</button>
        <button @click="changeShopStatus()" v-else type="button" class="bg-appGray rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-1">Activer</button>
      </div>
      <div class="relative py-2.5 bg-center bg-cover h-full w-full rounded-xl my-5 px-6" :style="{backgroundImage:`url(${shop.banner})` } ">
        <div id="navbarChild" class="container">
          <div class="absolute inset-0 bg-black opacity-50 rounded-xl"></div>
          <div class="relative z-10 flex justify-end px-2.5"></div>
          <div class=" relative z-10 grid grid-cols-8 items-center ">
            <div class=" col-span-7 m-4 pl-16 flex flex-col items-center">
              <img class=" w-32 h-32 rounded-full opacity-100" v-if="shop" :src="shop.logo" alt="Shop Logo">
              <h1 class="font-sora font-extra-bold text-4xl text-white ">{{shop.name}}</h1>
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
      </div>

      <div class="flex items-center mb-3">
        <p class="justify-center font-poppins font-semibold text-heading-3 mr-6">Produits</p>

      </div>

    </div>
  </div>

  <!-- Main modal -->
  <div id="default-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div v-if="shop" class="relative p-4 w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Informations
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
            {{shop.description}}
          </p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
