<script setup lang="ts">

import ProductCard from '@/components/shop/ProductCard.vue'
import { onMounted, ref, watch } from 'vue'
import type { Product } from '@/models/product'
import { useProductStore } from '@/stores/shop/products'
import type { Page } from '@/models/page'

const productStore = useProductStore();
const products = ref<Page<Product>|null>();
onMounted(()=>{
  products.value = productStore.product;

  watch(()=>productStore.product, (newProducts)=>{
    products.value=newProducts;
  })
})
</script>

<template>
  <div class="flex flex-wrap items-center justify-evenly">
    <div v-for="(product,index) in products?.data" :key="index" class="w-5/12">
      <ProductCard :product="product"/>
    </div>
  </div>
</template>

<style scoped>

</style>
