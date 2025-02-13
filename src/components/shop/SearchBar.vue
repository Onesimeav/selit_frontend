<script setup lang="ts">
import { useShopStore } from '@/stores/shop/shops'
import { onMounted, ref, watch } from 'vue'
import type { Product } from '@/models/product'
import type { Page } from '@/models/page'
import { useProductStore } from '@/stores/shop/products'

const props = defineProps<{
  blackVersion: boolean,
  categoryId?: number,
}>()
const emit = defineEmits<{
  (event:'searchResult',result:Page<Product>):Page<Product>;
  (event:'searchEnd'):void;
}>();
const productStore = useProductStore();
const keyword = ref<string>();
const shopStore = useShopStore();
const shopName = ref<string | null>(null);

const searchProduct= async ()=>{
  if (keyword.value){
    let searchResult : Page<Product>;
    if (props.categoryId){
      searchResult = await productStore.searchProduct(keyword.value,props.categoryId);
    }else{
      searchResult = await  productStore.searchProduct(keyword.value,props.categoryId);
    }
    emit('searchResult',searchResult);
  }

}

onMounted(() => {
  if (shopStore.shop) {
    shopName.value = shopStore.shop.name;
  }
})
watch(() => shopStore.shop, (newShop) => {
  if (newShop) {
    shopName.value = newShop.name;
  }
})

</script>

<template>
  <form class="m-1 px-1.5 max-w-screen-lg mx-auto w-full" @submit.prevent="searchProduct">
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
      <div v-if="keyword" @click="emit('searchEnd')" class="absolute inset-y-0 z-20 end-1/3 flex items-center ps-3 ">
        <svg :class="{'text-black': !blackVersion, 'text-white': blackVersion}" class="w-4 h-4 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
      </div>
      <div class="absolute  inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg :class="{'text-appBlack': !blackVersion, 'text-white': blackVersion}" class="w-4 h-4 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <input type="search" id="default-search"
             :class="{'bg-appGray text-appBlack placeholder-gray-800 focus:ring-appBlack focus:border-appBlack': !blackVersion, 'bg-appBlack text-white placeholder-gray-300 focus:ring-appGray focus:border-appGray': blackVersion}"
             class="border-none block w-full p-4 ps-10 text-md rounded-lg"
             :placeholder="`Chercher un produit sur ${shopName}`"
             required v-model="keyword"/>
      <button type="submit" class="text-white text-normal-text font-sora font-regular absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </button>
    </div>
  </form>
</template>

<style scoped>

</style>
