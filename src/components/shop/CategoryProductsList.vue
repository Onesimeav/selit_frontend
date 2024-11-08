<script setup lang="ts">

import ProductCard from '@/components/shop/ProductCard.vue'
import { onMounted, ref } from 'vue'
import type { Product } from '@/models/product'
import type { Page } from '@/models/page'
import { useCategoryStore } from '@/stores/shop/categories'

const props = defineProps<{
  categoryId: number,
}>()
const categoryStore = useCategoryStore();
const products = ref<Page<Product>>();
const moreProducts = ref<Page<Product>>();
const page = ref(0);
const getProducts = async () => {
  products.value= await categoryStore.getCategoryProduct(props.categoryId);
  page.value++;
}

const loadMore = async () => {
  moreProducts.value = await categoryStore.getCategoryProduct(props.categoryId, page.value);
  if (moreProducts.value && moreProducts.value.data.length >0){
    page.value++;
    if (products.value) {
      products.value.data = [...products.value.data, ...moreProducts.value.data];
    } else {
      products.value = moreProducts.value;
    }

  }
}

onMounted(getProducts)

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
