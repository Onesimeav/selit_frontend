<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop/shops'
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/shop/products'
import { useCategoryStore } from '@/stores/shop/categories'
import { useCartStore } from '@/stores/shop/carts'

const router = useRouter();
const host = window.location.host;
const subdomain = host.split('.');
if (subdomain[0]==='www'){
  if (subdomain[1]===import.meta.env.VITE_DOMAIN_NAME){}else{}
}else if(subdomain[0]===import.meta.env.VITE_DOMAIN_NAME){}else {
  const shopStore = useShopStore();
  onMounted(async ()=>{
    const shopAcess= await shopStore.getShop(subdomain[0]);
    if (!shopAcess){
      await router.replace({ path: '/404' })
    }else{
      const productStore = useProductStore();
      const categoryStore = useCategoryStore();
      const cartStore = useCartStore();
      await productStore.getProducts();
      await categoryStore.getCategory();
      cartStore.getCart();
      await cartStore.getCartPromotions();
    }
  })
}
</script>

<template>

  <RouterView />
</template>

<style scoped>
body{
  background-color: white;
}
</style>
