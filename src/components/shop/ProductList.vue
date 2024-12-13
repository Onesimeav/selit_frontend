<script setup lang="ts">

import ProductCard from '@/components/shop/ProductCard.vue'
import { onMounted, ref, watch } from 'vue'
import type { Product } from '@/models/product'
import { useProductStore } from '@/stores/shop/products'
import type { Page } from '@/models/page'

const props = defineProps<{
  searchResult?:Page<Product>;
}>()
const productStore = useProductStore();
const products = ref<Page<Product>|null>();

onMounted(()=>{
  if (props.searchResult){
    products.value=props.searchResult;
  }else{
    products.value = productStore.product;
  }
})

if (props.searchResult){
  watch(()=>props.searchResult, (newProducts)=>{
    products.value=newProducts;
  })
}else{
  watch(()=>productStore.product, (newProducts)=>{
    products.value=newProducts;
  })
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-evenly mb-3">
    <div v-if="searchResult?.data.length==0">
      <p class="font-rubik font-normal text-normal-text text-gray-500">Aucun produit correspondant</p>
    </div>
    <div v-for="(product,index) in products?.data" :key="index" class="w-5/12">
      <ProductCard :product="product"/>
    </div>
  </div>
</template>

<style scoped>

</style>
