<script setup lang="ts">
  import { useCartStore } from '@/stores/shop/carts'
  const emit = defineEmits<{
    (event:'newPromotion'):void;
  }>()
  const cartStore = useCartStore();
  const verifyPromotion = ()=>{
    const promotionInputElement = document.getElementById('promotion-input') as HTMLInputElement;
    if (promotionInputElement){
      cartStore.addPromotionCode(promotionInputElement.value);
      emit('newPromotion');
    }
  }
</script>

<template>
  <div class="flex items-center justify-center">
    <form class=" w-10/12 mx-1.5">
      <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div class="relative">
        <input id="promotion-input" type="search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-appGray focus:border-appGray dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Entrer votre code promo" required />
        <button type="button" @click="verifyPromotion" class="text-white absolute h-full end-0 bottom-0 bg-appBlack hover:bg-black  focus:outline-none rounded-lg  px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg class="w-8 h-8 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
          </svg>
        </button>
      </div>
    </form>
  </div>

</template>

<style scoped>

</style>
