<script setup lang="ts">
 import SearchBar from '@/components/shop/SearchBar.vue'
 import { onMounted, ref } from 'vue'
 import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
 import Orders from '@/components/shop/Orders.vue'
 import { initFlowbite } from 'flowbite'
 import ProductCartButton from '@/components/shop/ProductCartButton.vue'
 import CategoryProductsList from '@/components/shop/CategoryProductsList.vue'
 import { useOrderStore } from '@/stores/shop/orders'

 const orderStore = useOrderStore();
 const ordersId = orderStore.ordersId;
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
    <div v-if="ordersId">
      <Orders v-if="ordersId.length>=1" :orders-count="ordersId.length"/>
    </div>

  </div>
  <p class="text-black font-rubik font-semibold text-heading-2 m-2.5">{{$route.params.name}}</p>
  <CategoryProductsList :category-id="Number($route.params.id)"/>
  <ProductCartButton/>
</template>

<style scoped>

</style>
