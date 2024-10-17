<script setup lang="ts">
 import SearchBar from '@/components/SearchBar.vue'
 import { onMounted, ref } from 'vue'
 import PreviousPageButton from '@/components/PreviousPageButton.vue'
 import Orders from '@/components/Orders.vue'
 import { initFlowbite } from 'flowbite'
 import ProductCartButton from '@/components/ProductCartButton.vue'
 import ProductCard from '@/components/ProductCard.vue'

 const isSearchBarBlack = ref(false);
 const product = ref({
   id:1,
   imageUrl:"https://res.cloudinary.com/dklf43wgz/image/upload/v1726096668/products/images/duiywx39wqpittqrqvkz.jpg",
   name:'Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport',
   price:599
 });
 onMounted( ()=>{
   initFlowbite()
 })
</script>

<template>
  <div class="z-10 sticky top-0 bg-white">
    <div class="flex items-center justify-between  pt-2">
      <PreviousPageButton/>
      <SearchBar :black-version="isSearchBarBlack"/>
    </div>
    <Orders/>
  </div>
  <p class="text-black font-rubik font-semibold text-heading-2 mx-2.5">Tout les produits</p>
  <div class="flex flex-wrap items-center justify-evenly">
    <div class="w-5/12">
      <ProductCard :product="product" />
    </div>
    <div class="w-5/12">
      <ProductCard :product="product" />
    </div>
    <div class="w-5/12">
      <ProductCard :product="product" />
    </div>
    <div class="w-5/12">
      <ProductCard :product="product" />
    </div>
    <div class="w-5/12">
      <ProductCard :product="product" />
    </div>
   <div class="w-5/12">
      <ProductCard :product="product" />
    </div>
   <div class="w-5/12">
      <ProductCard :product="product" />
    </div>
   <div class="w-5/12">
      <ProductCard :product="product" />
    </div>

  </div>
  <ProductCartButton/>
</template>

<style scoped>

</style>
