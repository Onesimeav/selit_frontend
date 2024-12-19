<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop/shops'
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/shop/products'
import { useCategoryStore } from '@/stores/shop/categories'
import { useCartStore } from '@/stores/shop/carts'
import { useOrderStore } from '@/stores/shop/orders'
import { useUserStore } from '@/stores/dashboard/user'
import { initFlowbite } from 'flowbite'

const router = useRouter();
const host = window.location.host;
const subdomain = host.split('.');

const getCurrentUser = async () => {
  const userStore = useUserStore();
  if (!await userStore.getCurrentUser()) {
    await router.replace({ path: '/login' });
  }
};

const startShop = async (shopName:string) => {
  const shopStore = useShopStore();
  const shopAccess = await shopStore.getShop(shopName);
  if (!shopAccess) {
    await router.replace({ path: '/404' });
  } else {
    const productStore = useProductStore();
    const categoryStore = useCategoryStore();
    const cartStore = useCartStore();
    const orderStore = useOrderStore();

    await productStore.getProducts();
    await categoryStore.getCategory();
    cartStore.getCart();
    await cartStore.getCartPromotions();
    orderStore.getLocalOrders();
  }
};

const initApp = () => {
  const domain = subdomain[0] === 'www' ? subdomain[1] : subdomain[0];
  const mainDomain = import.meta.env.VITE_DOMAIN_NAME;

  if (domain === mainDomain) {
    getCurrentUser();
  } else {
    startShop(domain);
  }
};

onMounted(() => {
  initFlowbite();
  initApp();
});

</script>

<template>

  <RouterView />
</template>

<style scoped>
body{
  background-color: white;
}
</style>
