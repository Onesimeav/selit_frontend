<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'
import ShopHeader from '@/components/ShopHeader.vue'
import ProductsCarrousel from '@/components/ProductsCarrousel.vue'
import CategoryLink from '@/components/CategoryLink.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductCartButton from '@/components/ProductCartButton.vue'
const product = ref({
  id:1,
  imageUrl:"https://res.cloudinary.com/dklf43wgz/image/upload/v1726096668/products/images/duiywx39wqpittqrqvkz.jpg",
  name:'Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport',
  price:599
  });
const products = ref([product.value,product.value,product.value,product.value,product.value,product.value,product.value,product.value,product.value,])
onMounted( ()=>{
  initFlowbite()
})
</script>

<template>
  <ShopHeader/>
  <CategoryLink class="mt-3"/>
  <ProductsCarrousel :products="products"/>
  <CategoryLink/>
  <ProductsCarrousel :products="products"/>
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
  </div>
  <ProductCartButton/>
</template>
