<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shops'
import { onMounted } from 'vue'

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
