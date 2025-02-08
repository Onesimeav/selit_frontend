<script setup lang="ts">

import CreateButton from '@/components/dashboard/CreateButton.vue'
import SearchBarComponent from '@/components/dashboard/SearchBarComponent.vue'
import { useUserStore } from '@/stores/dashboard/user'
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { initFlowbite } from 'flowbite'
import { useDashboardShopStore } from '@/stores/dashboard/shop'
import type { Shop } from '@/models/shop'
import ShopPublishedStatusFilter from '@/components/dashboard/ShopPublishedStatusFilter.vue'


const userStore = useUserStore();
const shopStore = useDashboardShopStore();
const router = useRouter();

const shops = ref<Shop[]>();
const searchWord = ref<string>();
ref<number>()
const publish = ref<boolean>()

const getShops = async ()=>{
  while (userStore.loading){
    await new Promise(resolve => {setTimeout(resolve,100)})
  }
  await shopStore.getUserShops(searchWord.value,publish.value)
}

const filterShopByPublishedStatus=async (published?:boolean)=>{
  publish.value=published;
  await getShops();
}

const filterShopsBySearchTerm = async (searchTerm?:string) =>{
  searchWord.value=searchTerm;
  await getShops();
}

const redirectToShopDetails =(subdomain:string)=>{
  router.push(`shop/${subdomain}`);
}


onMounted(()=>{
  getShops();
  if(shopStore.shops){
    shops.value=shopStore.shops;
  }
  initFlowbite();
})

watch(()=>shopStore.shops,(newShops)=>{
  if(newShops){
    shops.value=newShops;
  }
})
</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div v-if="shops">
      <div class="flex justify-between w-full">
        <search-bar-component @reset-search-filter="filterShopsBySearchTerm" @search="searchTerm => filterShopsBySearchTerm(searchTerm)"/>
        <div class="flex items-center justify-between">
          <create-button route-name="create-shop"/>
          <shop-published-status-filter @change-status="published => filterShopByPublishedStatus(published)" @reset-shop-filter="filterShopByPublishedStatus()"/>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div v-for="shop in shops" :key="shop.id">
          <div class="border-none rounded-lg shadow shadow-gray-300 hover:shadow-md mx-4 my-8 p-4">
            <button @click="redirectToShopDetails(shop.subdomain)">
              <img :src="shop.logo" alt="shop-logo" width="200" height="200" class="rounded-lg mb-4">
              <span class="font-poppins font-semibold text-heading-3 text-left">{{shop.name}}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class=" w-full justify-center items-center">
      <p class="font-poppins font-normal text-normal-text text-appGray">Aucune boutiques disponible</p>
    </div>
  </div>
</template>

<style scoped>

</style>
