<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
  import { initFlowbite } from 'flowbite'
  import { useDashboardShopStore } from '@/stores/dashboard/shop'
  import type { Shop } from '@/models/shop'
import { useUserStore } from '@/stores/dashboard/user'

  const shopStore = useDashboardShopStore();
  const userStore = useUserStore();
  const shops = ref<Shop[]>();
  const emit = defineEmits<{
    (event:'change-shop',shopId:number):number,
    (event:'reset-shop-filter'):void,
  }>()
  const actualShop = ref('Toutes');

  const getShop = async ()=>{
    while(userStore.loading){
      await new Promise(resolve => setTimeout(resolve,100));
    }
    await shopStore.getUserShops();
    if (shopStore.shops){
      shops.value=shopStore.shops;
    }else{
      console.log("Une erreur s'est produite lors de la récupération des produits");
    }

  }

  const changeShop = (shopId?:number,shopName?:string)=>{
    if (shopId && shopName){
      actualShop.value=shopName;
      emit('change-shop',shopId);
    }else{
      actualShop.value='Toutes';
      emit('reset-shop-filter');
    }
  }

  onMounted(async () =>{
    await getShop();
    initFlowbite();
  });

  watch(()=>shopStore.shops,(newShops)=>{
    if (newShops){
      shops.value=newShops;
    }
  })
</script>

<template>

  <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" type="button" class="m-4">
   <div class="flex justify-between items-center grid-cols-8">
     <div class="col-span-2 rounded-md bg-blue-400 px-2 py-1 m-2 text-white font-bold">{{actualShop}}</div>
     <div class="col-span-6 grid-cols-4 flex items-center justify-around">
         <div class="col-span-2 font-poppins font-normal text-normal-text text-appGray">Boutique</div>
         <div class="col-span-2">
           <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
           </svg>
         </div>
     </div>
   </div>
  </button>

  <!-- Dropdown menu -->
  <div  id="dropdownHover" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    <ul v-if="shops" class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
      <li>
        <button @click="changeShop()"  class=" w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Toutes</button>
        <button v-for="(shop,index) in shops" :key="index" @click="changeShop(shop.id,shop.name)"  class=" w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{{shop.name}}</button>
      </li>
    </ul>
  </div>

</template>

<style scoped>

</style>
