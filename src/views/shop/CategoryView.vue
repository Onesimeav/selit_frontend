<script setup lang="ts">
 import SearchBar from '@/components/shop/SearchBar.vue'
 import { onMounted, ref } from 'vue'
 import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
 import Orders from '@/components/shop/Orders.vue'
 import { initFlowbite } from 'flowbite'
 import ProductCartButton from '@/components/shop/ProductCartButton.vue'
 import CategoryProductsList from '@/components/shop/CategoryProductsList.vue'
 import { useOrderStore } from '@/stores/shop/orders'
 import type { Page } from '@/models/page'
 import type { Product } from '@/models/product'
 import ProductList from '@/components/shop/ProductList.vue'

 const orderStore = useOrderStore();
 const ordersId = orderStore.ordersId;
 const isSearchBarBlack = ref(false);
 const isSearching = ref(false);
 const searchResult = ref<Page<Product>>();

 onMounted( ()=>{
   initFlowbite()
 })
</script>

<template>
  <div class="z-10 sticky top-0 bg-white">
    <div class="flex items-center justify-between  pt-2">
      <PreviousPageButton/>
      <SearchBar :black-version="isSearchBarBlack" :category-id="Number($route.params.id)" @search-result="result => {searchResult=result; isSearching=true}" @search-end="() => {isSearching=false}"  />
    </div>
    <div v-if="ordersId">
      <Orders v-if="ordersId.length>=1" :orders-count="ordersId.length"/>
    </div>
  </div>
  <div v-if="!isSearching">
    <p class="text-black font-rubik font-semibold text-heading-2 m-2.5">{{$route.params.name}}</p>
    <CategoryProductsList :category-id="Number($route.params.id)"/>
    <ProductCartButton/>
  </div>
  <div v-if="isSearching">
    <p class="text-black font-rubik font-semibold text-heading-2 mx-2.5">Resultat de recherche</p>
    <ProductList :searchResult="searchResult"/>
  </div>
</template>

<style scoped>

</style>
