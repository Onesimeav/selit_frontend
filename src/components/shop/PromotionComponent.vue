<script setup lang="ts">

import PromotionSearchBar from '@/components/shop/PromotionSearchBar.vue'
import PromotionCodeDisplay from '@/components/shop/PromotionCodeDisplay.vue'
import { useCartStore } from '@/stores/shop/carts'

const emit = defineEmits<{
  (event:'updateCart'):void;
}>()
console.log(localStorage.getItem('cart'));
const cartStore = useCartStore();
console.log(cartStore.promotions)
</script>

<template>
  <promotion-code-display @remove-promotion="emit('updateCart');console.log('remove')"/>
  <promotion-search-bar @new-promotion="emit('updateCart'); console.log('add')"/>
</template>

<style scoped>

</style>
