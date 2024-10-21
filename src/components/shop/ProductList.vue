<script setup lang="ts">

import ProductCard from '@/components/shop/ProductCard.vue'
import { useShopStore } from '@/stores/shops'
import { onMounted, ref, watch } from 'vue'
import type { Product } from '@/models/product'

const shopStore = useShopStore();
const products = ref<Product[]|null>();
onMounted(()=>{
  products.value = shopStore.products;

  watch(()=>shopStore.products, (newProducts)=>{
    products.value=newProducts;
  })
})
</script>

<template>
  <div class="flex flex-wrap items-center justify-evenly">
    <div v-for="(product,index) in products" :key="index" class="w-5/12">
      <ProductCard :product="product"/>
    </div>
  </div>
</template>

<style scoped>

</style>
