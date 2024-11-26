<script setup lang="ts">
   import type { OrderProduct } from '@/models/order'

   const props = defineProps<{
     orderProduct:OrderProduct;
   }>()
</script>

<template>
  <div class="grid grid-cols-5 mx-4 mt-4 items-center">
    <div class="col-span-1 h-full border-none rounded-lg bg-appGray font-rubik font-semibold text-heading-3 flex items-center justify-center">{{orderProduct.product_quantity}}x</div>
    <div class="col-span-4 ml-2">
      <p class="font-rubik font-semibold text-normal-text">{{orderProduct.product_name}}</p>
      <p class="font-rubik font-regular text-normal-text">{{orderProduct.price_promotion_applied}} XOF</p>
    </div>
  </div>
</template>

<style scoped>

</style>
