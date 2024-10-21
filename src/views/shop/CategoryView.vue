<script setup lang="ts">
 import SearchBar from '@/components/shop/SearchBar.vue'
 import { onMounted, ref } from 'vue'
 import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
 import Orders from '@/components/shop/Orders.vue'
 import { initFlowbite } from 'flowbite'
 import ProductCartButton from '@/components/shop/ProductCartButton.vue'
 import ProductList from '@/components/shop/ProductList.vue'

 const isSearchBarBlack = ref(false);
 onMounted( ()=>{
   initFlowbite()
 })
</script>

<template>
  <div class="z-10 sticky top-0 bg-white">
    <div class="flex items-center justify-between  pt-2">
      <PreviousPageButton/>
      <SearchBar :black-version="isSearchBarBlack" />
    </div>
    <Orders/>
  </div>
  <p class="text-black font-rubik font-semibold text-heading-2 mx-2.5">Tout les produits</p>
  <ProductList/>
  <ProductCartButton/>
</template>

<style scoped>

</style>
