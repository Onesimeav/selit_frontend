<script setup lang="ts">
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import ShopHeader from '@/components/shop/ShopHeader.vue'
import ProductsCarrousel from '@/components/shop/ProductsCarrousel.vue'
import CategoryLink from '@/components/shop/CategoryLink.vue'
import ProductCartButton from '@/components/shop/ProductCartButton.vue'
import ProductList from '@/components/shop/ProductList.vue'

onMounted( ()=>{
  initFlowbite()
})
</script>

<template>
  <ShopHeader/>
  <CategoryLink class="mt-3"/>
  <ProductsCarrousel/>
  <CategoryLink/>
  <ProductsCarrousel/>
  <p class="text-black font-rubik font-semibold text-heading-2 mx-2.5">Tout les produits</p>
  <ProductList/>
  <ProductCartButton/>
</template>
